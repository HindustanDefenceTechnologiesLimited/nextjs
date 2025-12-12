import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import { AssetStatus, AssetType, CreateAssetDto } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    TagsInput,
    TagsInputLabel,
    TagsInputItem,
    TagsInputInput,
    TagsInputClear,
    TagsInputList,
} from "@/components/ui/tags-input";
import { TagsInputItemDelete, TagsInputItemText } from '@diceui/tags-input'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import { FieldDescription } from '@/components/ui/field'
import api from '@/lib/auth'
import { toast } from 'sonner'
import { addAsset } from '@/store/slices/missionSlice'
type Props = {}

const CreateAssetButton = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const mission = useAppSelector((state: RootState) => state.mission.data);
    const dispatch = useAppDispatch();
    const [form, setForm] = React.useState<CreateAssetDto>({
        missionId: mission?.id || '',
        title: '',
        code: '',
        type: AssetType.PERSON,
        status: AssetStatus.AVAILABLE,
        capabilities: [],
        description: '',
        metadata: {},
    });
    const handleFormChange = (field: keyof CreateAssetDto, value: string | number | boolean | string[]) => {
        setForm({ ...form, [field]: value });
    };

    const handleCreateAsset = async () => {
        try {
            const res = await api.post('/api/asset/create', form);
            if(res.status === 201) {
                dispatch(addAsset(res.data.data));                
                toast.success('Asset created successfully.');
                setForm({
                    ...form,
                    title: '',
                    code: '',
                    type: AssetType.PERSON,
                    status: AssetStatus.AVAILABLE,
                    capabilities: [],
                    description: '',
                    metadata: {},
                })
                return;
            }
            toast.error(res.data.message);

        } catch (error) {
            toast.error('An unexpected error occurred. Either you are missing some fields or the code is already in use.');
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
                    Asset
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new Asset</DialogTitle>
                    <DialogDescription>
                        Create a new asset for this mission
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[80vh] space-y-3 overflow-y-auto">
                    <div className='space-y-2'>
                        <Label>Title <span className='text-red-500'>*</span></Label>
                        <Input placeholder="Title" value={form.title} onChange={(e) => handleFormChange('title', e.target.value)} />
                    </div>
                    <div className='space-y-2'>
                        <Label>Code <span className='text-red-500'>*</span></Label>
                        <Input placeholder="Code" value={form.code} onChange={(e) => handleFormChange('code', e.target.value)} />
                    </div>
                    <div className='space-y-2'>
                        <Label>Type <span className='text-red-500'>*</span></Label>
                        <Select value={form.type} onValueChange={(value: AssetType) => handleFormChange('type', value)}>
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
                        <Select value={form.status} onValueChange={(value: AssetStatus) => handleFormChange('status', value)}>
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
                         value={form.capabilities} onValueChange={(value: string[]) => handleFormChange('capabilities', value)} editable addOnPaste>
                            <TagsInputList className='w-full dark:bg-input/30'>
                                {form.capabilities.map((capability) => (
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
                    <div className='space-y-2'>
                        <Label>Description</Label>
                        <Textarea placeholder="Description" value={form.description} onChange={(e) => handleFormChange('description', e.target.value)} />
                    </div>
                    <Button className='w-full' onClick={handleCreateAsset}>
                        Create Asset
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateAssetButton
