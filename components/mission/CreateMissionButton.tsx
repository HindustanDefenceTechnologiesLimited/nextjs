import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldDescription,

    FieldGroup,
    FieldLabel,

    FieldSet,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import DateTimePicker from "@/components/ui/date-time-picker"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Loader, PlusIcon } from "lucide-react"
import axios from "axios"
import { CreateMissionDto, MapCoordinates, Mission, MissionStatus } from "@/lib/types"

type Props = {
    onMissionCreated: (mission: Mission) => void
}



const CreateMissionButton = ({ onMissionCreated }: Props) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<CreateMissionDto>({
        name: "",
        type: "",
        description: "",
        startTime: new Date(),
        // endTime: 0,
        status: MissionStatus.NEW,
        createdById: "",
        // mapCoordinates: undefined,
        // metadata: {}
    })

    const handleSubmit = async () => {
        if (!form.name || !form.type || !form.startTime) {
            toast.error('Please fill in all required fields.');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post<Mission>(
                process.env.NEXT_PUBLIC_SERVER_URL + '/api/users',
                form
            );
            if (res.status === 201) {
                toast.success('Mission created successfully.');
            }
            onMissionCreated(res.data);
        } catch (error) {
            toast.error('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button ><PlusIcon /> Create Mission</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Mission</DialogTitle>
                        <DialogDescription>
                            Add following details to create a new Mission
                        </DialogDescription>
                    </DialogHeader>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Name<span className="text-red-500">*</span></FieldLabel>
                                <Input id="name" autoComplete="off" placeholder=""
                                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea id="description" autoComplete="off" placeholder=""
                                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="type">Mission Type<span className="text-red-500">*</span></FieldLabel>
                                <Select value={form.type} onValueChange={(e) => setForm({ ...form, type: e })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="ground">Ground Combat</SelectItem>
                                            <SelectItem value="air">Air Combat</SelectItem>
                                            <SelectItem value="navy">Navy Combat</SelectItem>
                                            <SelectItem value="submarine">Submarine Combat</SelectItem>
                                            <SelectItem value="search">Search</SelectItem>
                                            <SelectItem value="patrol">Patrol</SelectItem>
                                            <SelectItem value="escort">Escort</SelectItem>
                                            <SelectItem value="intercept">Intercept</SelectItem>
                                            <SelectItem value="interdict">Interdict</SelectItem>
                                            <SelectItem value="strike">Strike</SelectItem>
                                            <SelectItem value="bombing">Bombing</SelectItem>
                                            <SelectItem value="recon">Recon</SelectItem>
                                            <SelectItem value="recovery">Recovery</SelectItem>
                                            <SelectItem value="transport">Transport</SelectItem>
                                            <SelectItem value="supply">Supply</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>



                            <Field>
                                <FieldLabel htmlFor="description">Start Date Time<span className="text-red-500">*</span></FieldLabel>
                                <DateTimePicker onDateTimeChange={(date: Date) => { setForm({ ...form, startTime: (date) }) }} />
                                <FieldDescription>MM/dd/yyyy hh:mm:ss</FieldDescription>
                            </Field>


                        </FieldGroup>
                    </FieldSet>
                    <Separator />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            disabled={!form.name || !form.type || !form.status || !form.startTime || loading}
                            onClick={handleSubmit}
                            type="submit" > <Loader data-loading={loading} className="mr-2 data-[loading=true]:block hidden animate-spin" /> Create</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default CreateMissionButton