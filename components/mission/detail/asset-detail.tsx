import { Asset, AssetStatus, AssetType } from '@/lib/types'
import React from 'react'
import DetailLayout from './detail-layout'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldDescription } from '@/components/ui/field';
import { TagsInput, TagsInputClear, TagsInputInput, TagsInputItem, TagsInputList } from '@/components/ui/tags-input';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/auth';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hook';
import { updateAsset } from '@/store/slices/missionSlice';
import { setSidebarData } from '@/store/slices/sidebarSlice';


const AssetDetail = () => {
  const sidebarData = useSelector((state: RootState) => state.sidebar.data) as Asset;
  const [formData, setFormData] = React.useState<Asset>(sidebarData);
  const [loading, setLoading] = React.useState(false);
  const isDirty =  JSON.stringify(sidebarData) !== JSON.stringify(formData);
  const dispatch = useAppDispatch();
  const handleCancel = () => {
    setFormData(sidebarData);
  }
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/api/asset/update/${sidebarData?.id}`, formData);
      if (res.status === 201) {
        toast.success("Asset updated successfully!");
        dispatch(updateAsset(formData));
        dispatch(setSidebarData(res.data.data));
        setFormData(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to update asset");
    } finally {
      setLoading(false);
    }
  }
  return (
    <DetailLayout
      headerContent={
        <div className="flex justify-between w-full items-center ">
          <span className="font-semibold truncate">
            {sidebarData?.title}
          </span>
        </div>
      }
    >
      <div className="space-y-4 p-2">
        <div className='space-y-2'>
          <Label>Title</Label>
          <Input value={formData?.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} />
        </div>
        <div className='space-y-2'>
          <Label>Code</Label>
          <Input value={formData?.code} readOnly />
        </div>
        <div className='space-y-2'>
          <Label>Description</Label>
          <Textarea value={formData?.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} />
        </div>
        <div className='space-y-2'>
          <Label>Type <span className='text-red-500'>*</span></Label>
          <Select value={formData.type} onValueChange={(value: AssetType) => setFormData((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>

              {
                Object.values(AssetType).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label>Status <span className='text-red-500'>*</span></Label>
          <Select value={formData.status} onValueChange={(value: AssetStatus) => setFormData((prev) => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {
                Object.values(AssetStatus).map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label>Capabilities</Label>
          <FieldDescription>Press 'Enter' to add a new capabality</FieldDescription>
          <TagsInput className='w-full'
            value={formData.capabilities} onValueChange={(value: string[]) => setFormData((prev) => ({ ...prev, capabilities: value }))} editable addOnPaste>
            <TagsInputList className='w-full dark:bg-input/30'>
              {formData.capabilities.map((capability) => (
                <TagsInputItem key={capability} value={capability}>
                  {capability}
                </TagsInputItem>
              ))}
              <TagsInputInput placeholder="Add capability..." />
            </TagsInputList>
            <TagsInputClear asChild>
              <Button variant="outline">
                <RefreshCcw className="h-4 w-4" />
                Clear
              </Button>
            </TagsInputClear>
          </TagsInput>
        </div>
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
  )
}

export default AssetDetail