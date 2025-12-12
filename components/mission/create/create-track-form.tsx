"use client";

import React, { useState, useMemo } from "react";
import { TRACK_HIRARCHY } from "@/lib/constants";
import {
  TrackType,
  TrackStatus,
  ThreatLevel,
  Classification,
  CreateTrackDTO,
} from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/auth";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hook";
import { addTrack } from "@/store/slices/missionSlice";

/* ---------------- TYPES FOR SCHEMA ---------------- */

type PrimitiveType = "string" | "integer" | "boolean" | "enum" | "array" | "object";

interface AttributeSpec {
  type: PrimitiveType;
  options?: string[];
  items?: string;
  properties?: Record<string, AttributeSpec>;
  required?: boolean;
}

interface SubtypeSchema {
  name: string;
  attributes: Record<string, AttributeSpec>;
}

type TrackHierarchy = Record<string, { subtypes: SubtypeSchema[] }>;

/* ---------------- HELPERS ---------------- */

const safeClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const defaultForSpec = (spec: AttributeSpec): any => {
  switch (spec.type) {
    case "string":
    case "enum":
      return "";
    case "integer":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object": {
      const obj: any = {};
      for (const [k, v] of Object.entries(spec.properties ?? {})) {
        obj[k] = defaultForSpec(v);
      }
      return obj;
    }
  }
};

const buildDefaultAttributes = (schema: Record<string, AttributeSpec>) => {
  const out: Record<string, any> = {};
  for (const [key, spec] of Object.entries(schema)) {
    out[key] = defaultForSpec(spec);
  }
  return out;
};

/* ---------------- COMPONENT ---------------- */

const TrackCreate: React.FC<{ missionId: string }> = ({ missionId }) => {
  const hierarchy = TRACK_HIRARCHY as unknown as TrackHierarchy;
  const dispatch = useAppDispatch();
  // DTO form state
  const [data, setData] = useState<CreateTrackDTO>({
    trackId: "",
    description: "",
    type: TrackType.PERSON,
    status: TrackStatus.ACTIVE,
    threatLevel: ThreatLevel.NONE,
    missionId,
    metadata: {},
    classification: {
      size: "",
      color: "",
      subType: "",
      attributes: {},
    },
  });

  const getSubtypes = (type: TrackType): SubtypeSchema[] =>
    hierarchy[type]?.subtypes ?? [];

  const subtypeSchema = useMemo(() => {
    if (!data.classification?.subType) return null;
    return getSubtypes(data.type).find(
      (s) => s.name === data.classification!.subType
    ) ?? null;
  }, [data.type, data.classification?.subType]);

  /* ----------- Nested Attribute Update ----------- */

  const setNestedAttribute = (path: string, value: any) => {
    const parts = path.split(".");
    setData((prev) => {
      const next = safeClone(prev);
      if (!next.classification) next.classification = {};
      if (!next.classification.attributes)
        next.classification.attributes = {};

      let pointer: any = next.classification.attributes;

      for (let i = 0; i < parts.length - 1; i++) {
        if (typeof pointer[parts[i]] !== "object") pointer[parts[i]] = {};
        pointer = pointer[parts[i]];
      }

      pointer[parts.at(-1)!] = value;
      return next;
    });
  };

  /* ----------- Subtype Change ----------- */

  const handleSubtypeChange = (subtype: string) => {
    const schema = getSubtypes(data.type).find((s) => s.name === subtype);
    if (!schema) return;

    setData((prev) => ({
      ...prev,
      classification: {
        ...prev.classification,
        subType: subtype,
        attributes: buildDefaultAttributes(schema.attributes),
      },
    }));
  };

  /* ----------- Render Attribute Field ----------- */

  const renderField = (
    keyPath: string,
    spec: AttributeSpec,
    value: any
  ): React.ReactNode => {
    const label = keyPath.split(".").slice(-1)[0];

    switch (spec.type) {
      case "string":
        return (
          <Row
            key={keyPath}
            label={label}
            value={value ?? ""}
            onChange={(v) => setNestedAttribute(keyPath, v)}
          />
        );

      case "integer":
        return (
          <Row
            key={keyPath}
            label={label}
            value={value ?? 0}
            onChange={(v) => setNestedAttribute(keyPath, Number(v))}
          />
        );

      case "boolean":
        return (
          <SelectRow
            key={keyPath}
            label={label}
            value={String(value)}
            onChange={(v) => setNestedAttribute(keyPath, v === "true")}
            options={[
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]}
          />
        );

      case "enum":
        return (
          <SelectRow
            key={keyPath}
            label={label}
            value={value ?? ""}
            onChange={(v) => setNestedAttribute(keyPath, v)}
            options={(spec.options ?? []).map((o) => ({
              label: o,
              value: o,
            }))}
          />
        );

      case "array":
        return (
          <Row
            key={keyPath}
            label={label}
            value={(value ?? []).join(", ")}
            onChange={(v) =>
              setNestedAttribute(
                keyPath,
                v.split(",").map((x) => x.trim()).filter(Boolean)
              )
            }
          />
        );

      case "object":
        return (
          <div key={keyPath} className="mb-3">
            <Label>{label}</Label>
            <div className="border-l pl-3 mt-1 space-y-2">
              {Object.entries(spec.properties ?? {}).map(([sub, subSpec]) =>
                renderField(`${keyPath}.${sub}`, subSpec, value?.[sub])
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ----------- Submit ----------- */

  const handleCreate = async () => {
    if (!data.classification?.subType) {
      toast.error("Select a subtype");
      return;
    }

    toast.loading("Creating...", { id: "create" });

    try {
      const res = await api.post("/api/track/create", data);
      toast.success("Track created!", { id: "create" });
      dispatch(addTrack(res.data.data));
      // Reset
      setData({
        trackId: "",
        description: "",
        type: TrackType.PERSON,
        status: TrackStatus.ACTIVE,
        threatLevel: ThreatLevel.NONE,
        missionId,
        classification: { size: "", color: "", subType: "", attributes: {} },
      });

    } catch (e) {
      console.error(e);
      toast.error("Failed", { id: "create" });
    }
  };

  /* ----------- RENDER ----------- */

  return (

    <div className="p-3 space-y-4">

      <Row
        label="Track ID"
        value={data.trackId}
        onChange={(v) => setData({ ...data, trackId: v })}
      />

      <SelectRow
        label="Type"
        value={data.type}
        onChange={(v) =>
          setData({
            ...data,
            type: v as TrackType,
            classification: { size: "", color: "", subType: "", attributes: {} },
          })
        }
        options={Object.values(TrackType).map((t) => ({
          label: t,
          value: t,
        }))}
      />

      <Textarea
        className="mt-1"
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        placeholder="Description"
      />

      <SelectRow
        label="Status"
        value={data.status}
        onChange={(v) => setData({ ...data, status: v as TrackStatus })}
        options={Object.values(TrackStatus).map((s) => ({ label: s, value: s }))}
      />

      <SelectRow
        label="Threat Level"
        value={data.threatLevel}
        onChange={(v) =>
          setData({ ...data, threatLevel: v as ThreatLevel })
        }
        options={Object.values(ThreatLevel).map((s) => ({ label: s, value: s }))}
      />

      {/* Classification */}
      <h3 className="font-semibold mt-4">Classification</h3>

      <Row
        label="Size"
        value={data.classification?.size ?? ""}
        onChange={(v) =>
          setData({
            ...data,
            classification: { ...data.classification!, size: v },
          })
        }
      />

      <Row
        label="Color"
        value={data.classification?.color ?? ""}
        onChange={(v) =>
          setData({
            ...data,
            classification: { ...data.classification!, color: v },
          })
        }
      />

      {/* Subtype */}
      <SelectRow
        label="Subtype"
        value={data.classification?.subType ?? ""}
        onChange={handleSubtypeChange}
        options={getSubtypes(data.type).map((s) => ({
          label: s.name,
          value: s.name,
        }))}
      />

      {/* Dynamic attributes */}
      {subtypeSchema && (
        <div className="space-y-2">
          {Object.entries(subtypeSchema.attributes).map(([key, spec]) =>
            renderField(
              key,
              spec,
              data.classification?.attributes?.[key]
            )
          )}
        </div>
      )}

      <Button className="w-full" onClick={handleCreate}>
        Create Track
      </Button>
    </div>
  );
};

export default TrackCreate;

/* ---------------- SHARED UI ---------------- */

const Row = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const SelectRow = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((op) => (
          <SelectItem key={op.value} value={op.value}>
            {op.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
