"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileIcon, AudioLines, VideoIcon } from "lucide-react";
import { File } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
    files: File[];
};

export default function FileList({ files = [] }: Props) {
    const [open, setOpen] = React.useState(false);
    const [currentFile, setCurrentFile] = React.useState<File | null>(null);

    const handleOpen = (file: File) => {
        setCurrentFile(file);
        setOpen(true);
    };

    const renderPreview = (file: File) => {
        if (!file) return null;

        const url = `http://localhost:5000/api/file/${file.id}/view`;

        if (file.type.startsWith("image/")) {
            return (
                <img
                    src={url}
                    alt={file.name}
                    className="max-h-full max-w-full object-contain"
                />
            );
        }

        if (file.type.startsWith("video/")) {
            return (
                <video
                    src={url}
                    controls
                    className="max-h-full max-w-full rounded"
                />
            );
        }

        if (file.type.startsWith("application/pdf")) {
            return (
                <iframe
                    src={url}
                    className="w-full h-full"
                />
            );
        }
        
        return (
            <div className="flex flex-col items-center text-muted-foreground">
                <FileIcon className="size-16 mb-2" />
                <p>{file.name}</p>
            </div>
        );
    };

    return (
        <div className="flex overflow-x-auto py-1">
            <div className="flex gap-1">
                {files.map((file) => (
                    <FilePreview key={file.id} file={file} onClick={() => handleOpen(file)} />
                ))}
            </div>

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 h-[90vh] min-w-[90vw] max-w-none">
                    <div className="flex flex-col items-center justify-center h-full">

                        {/* Main Preview */}
                        <div className="flex justify-center items-center h-[80vh] w-full bg-black/5 p-4">
                            {currentFile && renderPreview(currentFile)}
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="max-w-[90vw] overflow-x-auto flex">

                            <div className="flex gap-2 py-3 px-3 border-t mx-auto">
                                {files.map((file) => (
                                    <Thumbnail
                                        key={file.id}
                                        file={file}
                                        active={file.id === currentFile?.id}
                                        onClick={() => handleOpen(file)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


const Thumbnail = ({
    file,
    active,
    onClick,
}: {
    file: File;
    active: boolean;
    onClick: () => void;
}) => {
    const url = `http://localhost:5000/api/file/${file.id}/view`;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-12 h-12 rounded overflow-hidden border flex items-center justify-center bg-accent",
                active ? "border-blue-500 ring-2 ring-blue-300" : "border-transparent"
            )}
        >
            {isImage ? (
                <img src={url} className="w-full h-full object-cover" alt={file.name} />
            ) : isVideo ? (
                <VideoIcon className="size-5 opacity-70" />
            ) : isAudio ? (
                <AudioLines className="size-5 opacity-70" />
            ) : (
                <FileIcon className="size-5 opacity-70" />
            )}
        </button>
    );
};

//
// ========== Preview Component ==========
//
const FilePreview = ({
    file,
    onClick,
}: {
    file: File;
    onClick: () => void;
}) => {
    const url = `http://localhost:5000/api/file/${file.id}/view`;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");

    return (
        <button
            key={file.id}
            onClick={onClick}
            className="w-16 h-16 rounded bg-accent overflow-hidden flex items-center justify-center border hover:ring-2 ring-blue-300 transition"
        >
            {isImage ? (
                <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt={file.name}
                />
            ) : isVideo ? (
                <VideoIcon className="size-6 opacity-70" />
            ) : isAudio ? (
                <AudioLines className="size-6 opacity-70" />
            ) : (
                <FileIcon className="size-6 opacity-70" />
            )}
        </button>
    );
};
