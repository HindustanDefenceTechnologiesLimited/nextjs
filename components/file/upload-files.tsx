"use client";

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";

import {
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import api from "@/lib/auth";
import { toast } from "sonner";
import { useState } from "react";
import {File as FileType} from '@/lib/types'
const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file.type;
  const fileName = file.file.name;

  const iconMap = {
    archive: {
      conditions: (type: string, name: string) =>
        type.includes("zip") ||
        type.includes("archive") ||
        name.endsWith(".zip") ||
        name.endsWith(".rar"),
      icon: FileArchiveIcon,
    },
    audio: {
      conditions: (type: string) => type.includes("audio/"),
      icon: HeadphonesIcon,
    },
    excel: {
      conditions: (type: string, name: string) =>
        type.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx"),
      icon: FileSpreadsheetIcon,
    },
    image: {
      conditions: (type: string) => type.startsWith("image/"),
      icon: ImageIcon,
    },
    pdf: {
      conditions: (type: string, name: string) =>
        type.includes("pdf") ||
        name.endsWith(".pdf") ||
        type.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx"),
      icon: FileTextIcon,
    },
    video: {
      conditions: (type: string) => type.includes("video/"),
      icon: VideoIcon,
    },
  };

  for (const { conditions, icon: Icon } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className="size-5 opacity-60" />;
    }
  }

  return <FileIcon className="size-5 opacity-60" />;
};
const getFilePreview = (file: {
  file: File | { type: string; name: string; url?: string };
}) => {
  const fileType = file.file.type;
  const fileName = file.file.name;

  const renderImage = (src: string) => (
    <img
      alt={fileName}
      className="size-full rounded-t-[inherit] object-cover"
      src={src}
    />
  );

  return (
    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit] bg-accent">
      {fileType.startsWith("image/") ? (
        file.file instanceof File ? (
          renderImage(URL.createObjectURL(file.file))
        ) : (
          file.file.url ? renderImage(file.file.url) : <ImageIcon className="size-5 opacity-60" />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  );
};

type UploadFilesProps = {
  parentId: string;
  parentType: string;
  onUpload?: (files: FileType[]) => void;
};

export default function UploadFiles({ parentId, parentType, onUpload }: UploadFilesProps) {
  const maxSizeMB = 1024;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 12;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    multiple: true,
  });

  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async () => {
    if (files.length === 0) return toast.error("No files selected");

    setIsUploading(true);
    toast.loading("Uploading...", { id: "upload" });
    var uploadedFiles = [];
    try {
      for (const fileObj of files) {
        const file = fileObj.file as File;

        const form = new FormData();
        form.append("file", file);
        form.append("parentType", parentType);

        // dynamic key
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

        const response = await api.post("/api/file/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedFiles.push(response.data.data as FileType);
      }
      onUpload && onUpload(uploadedFiles);
      toast.success("All files uploaded!", { id: "upload" });
      clearFiles();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: "upload" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Drop Area */}
      <div
        className="relative flex min-h-52 flex-col items-center not-data-files:justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-medium text-sm">
                Files ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button onClick={openFileDialog} size="sm" variant="outline">
                  <UploadIcon className="size-3.5 opacity-60" />
                  Add more
                </Button>
                <Button onClick={clearFiles} size="sm" variant="outline">
                  <Trash2Icon className="size-3.5 opacity-60" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map((file) => (
                <div
                  className="relative flex flex-col rounded-md border bg-background"
                  key={file.id}
                >
                  {getFilePreview(file)}
                  <Button
                    className="-top-2 -right-2 absolute size-6 rounded-full border-2 border-background"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                  <div className="flex flex-col gap-0.5 border-t p-3">
                    <p className="truncate font-medium text-[13px]">
                      {file.file.name}
                    </p>
                    <p className="truncate text-muted-foreground text-xs">
                      {formatBytes(file.file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload button */}
            <Button
              className="mt-2 w-full"
              disabled={isUploading}
              onClick={uploadFiles}
            >
              {isUploading ? "Uploading..." : "Upload All"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div className="mb-2 flex size-11 items-center justify-center rounded-full border bg-background">
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 font-medium text-sm">Drop your files here</p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} files ∙ Up to {maxSizeMB}MB
            </p>
            <Button className="mt-4" onClick={openFileDialog} variant="outline">
              <UploadIcon className="opacity-60" />
              Select files
            </Button>
          </div>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="flex items-center gap-1 text-destructive text-xs">
          <AlertCircleIcon className="size-3" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
