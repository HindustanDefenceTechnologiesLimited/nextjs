"use client";
import MapRectangleSelector from "@/components/map/components/map-rectangle-selector";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateGeofenceDto, GeofenceType } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MapCircleSelector from "@/components/map/components/map-circle-selector";
import api from "@/lib/auth";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hook";
import { addGeofence } from "@/store/slices/missionSlice";

const initialGeometry = {
  shapeType: "rectangle" as const,
  coordinates: [],
  center: { lat: 0, lng: 0 },
};

const CreateGeofenceButton = () => {
  const mission = useSelector((state: RootState) => state.mission.data);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CreateGeofenceDto>({
    name: "",
    description: "",
    geometry: initialGeometry,
    type: GeofenceType.EXCLUSION,
    radius: undefined,
    altitude: 0,
    isActive: true,
    missionId: mission?.id ?? "",
  });

  /* ---------- helpers ---------- */

  const updateField = <K extends keyof CreateGeofenceDto>(
    key: K,
    value: CreateGeofenceDto[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateGeometry = (data: Partial<CreateGeofenceDto["geometry"]>) => {
    setForm((prev) => ({
      ...prev,
      geometry: {
        ...prev.geometry,
        ...data,
      },
    }));
  };

  const handleShapeTypeChange = (shapeType: "circle" | "rectangle") => {
    setForm((prev) => ({
      ...prev,
      radius: shapeType === "circle" ? 0 : undefined,
      geometry: {
        shapeType,
        coordinates: [],
      },
    }));
  };

  const isValidGeometry =
    form.geometry.shapeType === "rectangle"
      ? form.geometry.coordinates.length === 2
      : form.geometry.coordinates.length === 1 &&
      typeof form.radius === "number" &&
      form.radius > 0;


  const handleSubmit = async () => {
    if (!form.name || !isValidGeometry) {
      toast.error("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/geofence/create", form);
      if (res.status === 201) {
        toast.success("Geofence created successfully");
        setOpen(false);
        setForm({
          ...form,
          name: "",
          description: "",
          geometry: initialGeometry,
          radius: undefined,
        });
        dispatch(addGeofence(res.data.data));
      } else {
        toast.error("Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          Geofence
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-y-auto pb-0">
        <DialogHeader>
          <DialogTitle>Create Geofence</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name + Shape */}
          <div className="flex gap-4">
            <div className="w-full space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Geofence name"
              />
            </div>

            <div className="w-full space-y-2">
              <Label>Shape Type</Label>
              <Select
                value={form.geometry.shapeType}

                onValueChange={handleShapeTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue className="w-full" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Shape</SelectLabel>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Geofence Type</Label>
            <RadioGroup
              value={form.type}
              onValueChange={(value) =>
                updateField("type", value as GeofenceType)
              }
              className="grid grid-cols-3 gap-2"
            >
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">

                <RadioGroupItem value="INCLUSION" />
                <div className="flex flex-col gap-1">

                  <p className="text-sm leading-4">Inclusion</p>
                  <p className="text-muted-foreground text-xs">

                    Triggers an event when an track or asset enters the
                    geofence.
                  </p>
                </div>
              </Label>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">

                <RadioGroupItem value="EXCLUSION" />
                <div className="flex flex-col gap-1">

                  <p className="text-sm leading-4">Exclusion</p>
                  <p className="text-muted-foreground text-xs">

                    Triggers an event when an track or asset leaves the
                    geofence.
                  </p>
                </div>
              </Label>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">

                <RadioGroupItem value="ALERT_ZONE" />
                <div className="flex flex-col gap-1">

                  <p className="text-sm leading-4">Alert Zone</p>
                  <p className="text-muted-foreground text-xs">

                    Triggers an alert when an track or asset enters or leaves
                    the geofence.
                  </p>
                </div>
              </Label>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">

                <RadioGroupItem value="SAFE_ZONE" />
                <div className="flex flex-col gap-1">

                  <p className="text-sm leading-4">Safe Zone</p>
                  <p className="text-muted-foreground text-xs">

                    No triggers, just a visual representation of the geofence
                    with green color.
                  </p>
                </div>
              </Label>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">

                <RadioGroupItem value="RESTRICTED_AREA" />
                <div className="flex flex-col gap-1">

                  <p className="text-sm leading-4">Restricted Area</p>
                  <p className="text-muted-foreground text-xs">

                    No triggers, just a visual representation of the geofence
                    with red color.
                  </p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Geometry */}
          {form.geometry.shapeType === "rectangle" ? (
            <div className="space-y-2">
              <Label>Rectangle</Label>
              <Alert>
                <AlertCircleIcon />
                <AlertTitle>How to select</AlertTitle>
                <AlertDescription>
                  Select top-right corner, then bottom-left corner.
                </AlertDescription>
              </Alert>
              <MapRectangleSelector
                onSelect={(lng1, lat1, lng2, lat2) =>
                  updateGeometry({
                    shapeType: "rectangle",
                    coordinates: [
                      [lng1, lat1],
                      [lng2, lat2],
                    ],
                    center: {
                      lng: (lng1 + lng2) / 2,
                      lat: (lat1 + lat2) / 2,
                    },
                  })

                }
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Circle</Label>
              <Alert>
                <AlertCircleIcon />
                <AlertTitle>How to select</AlertTitle>
                <AlertDescription>
                  Select center, then select radius.
                </AlertDescription>
              </Alert>
              <MapCircleSelector
                onSelect={(lng, lat, radius) =>
                  setForm((prev) => ({
                    ...prev,
                    radius,
                    geometry: {
                      shapeType: "circle",
                      coordinates: [[lng, lat]],
                      center: { lng, lat },
                    },
                  }))
                }
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Optional description"
            />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex justify-end gap-2 bg-background/80 py-2 backdrop-blur">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={loading || !isValidGeometry}
            >
              {loading ? "Creating…" : "Create Geofence"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGeofenceButton;
