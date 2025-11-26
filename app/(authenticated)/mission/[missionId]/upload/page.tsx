"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "@/lib/auth";
import { toast } from "sonner";
import ImageViewer from "./Image";

const PARENT_TYPES = [
  "MISSION",
  "TRACK",
  "ASSET",
  "SENSOR",
  "USER",
  "ANNOTATION",
  "GEOFENCE",
] as const;

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [parentType, setParentType] = useState<string>("MISSION");
    const [saved, setSaved] = useState<string>("");
  // Stores dynamic parent ID (trackId / missionId etc.)
  const [parentId, setParentId] = useState("");

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");

    if (!parentType) return toast.error("Select a parent type");

    if (!parentId) return toast.error("Please enter parent ID");

    const form = new FormData();
    form.append("file", file);
    form.append("parentType", parentType);
    form.append("ownerId", 'c9447e57-1df1-4e28-a699-6045595398c4');

    // Append relevant dynamic key
    switch (parentType) {
      case "TRACK":
        form.append("trackId", parentId);
        break;
      case "MISSION":
        form.append("missionId", parentId);
        break;
      case "USER":
        form.append("userId", parentId);
        break;
      case "ASSET":
        form.append("assetId", parentId);
        break;
      case "SENSOR":
        form.append("sensorId", parentId);
        break;
      case "ANNOTATION":
        form.append("annotationId", parentId);
        break;
      case "GEOFENCE":
        form.append("geofenceId", parentId);
        break;
    }

    try {
      toast.loading("Uploading...", { id: "upload" });

      const res = await api.post("/api/file/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Uploaded successfully!", { id: "upload" });
      console.log(res.data);

      // clear
      setFile(null);
      setParentId("");

    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: "upload" });
    }
  };

  return (
    <div className="p-4 border rounded-md space-y-4">
      
      {/* FILE PICKER */}
      <div>
        <Label>Select File</Label>
        <Input
          type="file"
          className="mt-2"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* PARENT TYPE SELECT */}
      <div>
        <Label>Attach To</Label>
        <Select value={parentType} onValueChange={setParentType}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select parent type" />
          </SelectTrigger>
          <SelectContent>
            {PARENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PARENT ID FIELD */}
      <div>
        <Label>
          {parentType === "MISSION" && "Mission ID"}
          {parentType === "TRACK" && "Track ID"}
          {parentType === "ASSET" && "Asset ID"}
          {parentType === "SENSOR" && "Sensor ID"}
          {parentType === "USER" && "User ID"}
          {parentType === "ANNOTATION" && "Annotation ID"}
          {parentType === "GEOFENCE" && "Geofence ID"}
        </Label>

        <Input
          className="mt-2"
          placeholder={`Enter ${parentType.toLowerCase()} id`}
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        />
      </div>

      {/* SUBMIT */}
      <Button className="w-full" onClick={handleUpload}>
        Upload
      </Button>

      <ImageViewer fileId={'cmigggh6f0003u4d4gqs6cvf7'} />
    </div>
  );
}
