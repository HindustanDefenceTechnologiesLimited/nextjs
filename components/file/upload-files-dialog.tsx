'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { File } from "@/lib/types"
import UploadFiles from "./upload-files"

type Props = {
  children?: React.ReactNode
  parentType: string
  parentId: string
  onUpload?: (files: File[]) => void
}

const UploadFilesDialog = ({ onUpload, parentId, parentType, children }: Props) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {
            children ? children : <Button >Upload Files</Button>
          }
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>

          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">

            <UploadFiles
              onUpload={onUpload}
              parentId={parentId}
              parentType={parentType}
            />
          </div>

        </DialogContent>
      </form>
    </Dialog>
  )
}

export default UploadFilesDialog