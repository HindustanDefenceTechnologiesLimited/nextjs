"use client";

import { Track } from "@/lib/types";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import DetailLayout from "../detail-layout";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/auth";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TRACK_HIRARCHY } from "@/lib/constants";
import { useAppDispatch } from "@/store/hook";
import { setSidebarData } from "@/store/slices/sidebarSlice";
import {  updateTrack } from "@/store/slices/missionSlice";
import { renderIcon } from "../../list/track-list";
import TrackPositions from "./track-positions";
import TrackFiles from "./track-files";

const TrackDetail = () => {
  const [originalTrack, setOriginalTrack] = useState<Track>(useSelector((state: RootState) => state.sidebar.data) as Track);
  if (!originalTrack) return null;

  const dispatch = useAppDispatch();

  const [track, setTrack] = useState<Track>(JSON.parse(JSON.stringify(originalTrack)));
  const [loading, setLoading] = useState(false);

  const onChange = (key: keyof Track, value: any) => {
    setTrack((prev) => ({ ...prev, [key]: value }));
  };
  const getSubtypes = () => {
    if (!track.type) return [];
    return TRACK_HIRARCHY[track.type]?.subtypes || [];
  };
  const onAttributeChange = (key: string, value: any) => {
    setTrack((prev) => ({
      ...prev,
      classification: {
        ...prev.classification,
        attributes: {
          ...prev.classification?.attributes,
          [key]: value,
        },
      },
    }));
  };

  const handleCancel = () => {
    setTrack(JSON.parse(JSON.stringify(originalTrack)));
    toast.info("Changes reverted");
  };

  const handleSave = async () => {
    setLoading(true);
    toast.loading("Saving...", { id: "save" });

    try {
      await api.put(`/api/track/update/${track.id}`, track);
      toast.success("Track updated successfully!", { id: "save" });
      dispatch(setSidebarData(track));
      // dispatch(updateTrack(track as Track));
      setOriginalTrack(track);
    } catch (err) {
      toast.error("Failed to update track", { id: "save" });
    } finally {
      setLoading(false);
    }
  };

  const subtypeSchema = getSubtypes().find(
    (st: any) => st.name === track.classification?.subType
  );


  /* ------------------------------------------
      RENDER ATTRIBUTE INPUT BASED ON TYPE
  -------------------------------------------*/
  const renderAttributeField = (key: string, config: any, value: any) => {
    const label = formatKey(key);

    switch (config.type) {
      case "string":
        return (
          <DetailInputRow
            key={label}
            label={label}
            value={value ?? ""}
            onChange={(v) => onAttributeChange(key, v)}
          />
        );

      case "integer":
        return (
          <DetailInputRow
            key={label}

            label={label}
            value={value ?? ""}
            onChange={(v) => onAttributeChange(key, Number(v))}
          />
        );

      case "boolean":
        return (
          <div className="flex justify-between mb-2" key={label}>
            <Label>{label}</Label>
            <Select
              value={String(value ?? "")}
              onValueChange={(v) => onAttributeChange(key, v === "true")}
            >
              <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "enum":
        return (
          <div className="flex justify-between mb-2" key={label}>
            <Label>{label}</Label>
            <Select
              value={value ?? ""}
              onValueChange={(v) => onAttributeChange(key, v)}
            >
              <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {config.options.map((op: string) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "array":
        return (
          <DetailInputRow
            label={label}
            value={Array.isArray(value) ? value.join(", ") : ""}
            onChange={(v) =>
              onAttributeChange(
                key,
                v.split(",").map((s: string) => s.trim())
              )
            }
          />
        );

      case "object":
        return (
          <div className="mb-3">
            <Label className="w-full">{label}</Label>
            <div className="pl-2 pt-2 text-muted-foreground">
              {Object.entries(config.properties).map(([subKey, subConf]: any) =>
                renderAttributeField(
                  `${key}.${subKey}`,
                  subConf,
                  value?.[subKey] ?? ""
                )
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };



  const handleSubtypeChange = (newSubType: string) => {
    const subtypes = getSubtypes();
    const newSchema = subtypes.find((s: any) => s.name === newSubType);

    if (!newSchema) return;

    const oldAttrs = track.classification?.attributes || {};
    const newAttrsSpec = newSchema.attributes;

    // Sustain common keys
    const mergedAttrs: Record<string, any> = {};

    for (const key of Object.keys(newAttrsSpec as Record<string, any>)) {
      if (oldAttrs[key] !== undefined) mergedAttrs[key] = oldAttrs[key];
      else {
        // default for new keys
        mergedAttrs[key] = (newAttrsSpec as Record<string, any>)[key].type === "array"
          ? []
          : (newAttrsSpec as Record<string, any>)[key].type === "boolean"
            ? false
            : "";
      }
    }

    setTrack((prev) => ({
      ...prev,
      classification: {
        ...prev.classification,
        subType: newSubType,
        attributes: mergedAttrs,
      },
    }));
  };

  const isDirty = JSON.stringify(track) !== JSON.stringify(originalTrack);
  // TODO: Add accessibility to inputs, Return key hit
  return (
    <DetailLayout
      headerContent={
        <div className="flex justify-between w-full items-center ">
          <span className="font-semibold truncate">{(track.trackId).split('-').map((id) => id.charAt(0).toUpperCase() + id.slice(1)).join(' ')}</span>

        </div>
      }
    >
      <div className="space-y-4 p-2">

        <div >
          <p className="text-sm font-semibold mb-2">Track ID</p>
          <Input
            value={track.trackId}
            onChange={(e) => onChange("trackId", e.target.value)}
          />
        </div>
        <div className="flex justify-between" >
          <p className="text-sm font-semibold">Type</p>
          <span className="text-sm flex gap-2 items-center">{renderIcon(track)} {track.type}</span>
        </div>
        <Textarea
          placeholder="Description"
          value={track.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
        />
        <TrackFiles track={track}/>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label>Status</Label>
            <Select
              value={track.status}
              onValueChange={(v) => onChange("status", v)}
            >
              <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
                <SelectItem value="TERMINATED">TERMINATED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Label>Threat Level</Label>
            <Select
              value={track.threatLevel}
              onValueChange={(v) => onChange("threatLevel", v)}
            >
              <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Classification Section */}
        {track.classification && (
          <Section title="Classification">
            {/* Size */}
            <DetailInputRow
              label="Size"
              value={track.classification.size || ""}
              onChange={(v) =>
                setTrack((p) => ({
                  ...p,
                  classification: { ...p.classification, size: v },
                }))
              }
            />

            {/* Color */}
            <DetailInputRow
              label="Color"
              value={track.classification.color || ""}
              onChange={(v) =>
                setTrack((p) => ({
                  ...p,
                  classification: { ...p.classification, color: v },
                }))
              }
            />

            {/* Subtype */}
            <div className="mb-3 flex justify-between items-center">
              <Label>Subtype</Label>
              <Select
                value={track.classification?.subType || ""}
                onValueChange={handleSubtypeChange}
              >
                <SelectTrigger className="h-8 mt-1">
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent>
                  {getSubtypes().map((st: any) => (
                    <SelectItem key={st.name} value={st.name}>
                      {st.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Attributes */}
            {subtypeSchema && (
              <div className="mt-2">
                <h4 className="font-medium mb-1">Attributes</h4>

                {Object.entries(subtypeSchema.attributes).map(([key, config]: any) => {
                  const currentValue = track.classification?.attributes?.[key];
                  return (
                    <div key={key}>
                      {renderAttributeField(key, config, currentValue)}
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        )}
        <TrackPositions track={track} />
      </div>
      <div className="sticky bottom-0 bg-card/30 backdrop-blur-lg justify-end rounded-b-md p-2 flex gap-2">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          Revert
        </Button>
        <Button disabled={loading || !isDirty} size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>
    </DetailLayout>
  );
};

export default TrackDetail;

const DetailInputRow = ({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
}) => (
  <div className="flex items-center justify-between gap-1 mb-2">
    <Label className="w-full">{label}</Label>
    <Input
      {...props}
      className="py-0 h-8"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b pb-2">
    <span className="mb-1">{title}</span>
    {children}
  </div>
);

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
