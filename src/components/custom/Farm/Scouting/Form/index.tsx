import { memo, useState, useCallback } from "react";

import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Date from "@/components/custom/base/Date";
import Select from "@/components/custom/base/Select";
import { Separator } from "@/components/ui/separator";
import { CardTitle, CardHeader, CardFooter } from "@/components/ui/card";

type Props = {
    clearScoutingPoint: () => void;
};

const noteTypes: Array<"id" | "description"> = [];

const ScoutingForm = ({ clearScoutingPoint }: Props) => {
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
        (e) => {},
        []
    );

    return (
        <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>New Scouting</CardTitle>

                <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={clearScoutingPoint}
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <Separator className="my-2" />

            <div className="grid gap-6 px-6 py-3">
                {/* Farm Details Section */}

                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>

                    <Input
                        minLength={4}
                        maxLength={50}
                        required={true}
                        id="title"
                        name="title"
                        placeholder="Enter title"
                    />
                </div>

                <div className="grid gap-2">
                    <Select
                        label="Note Type"
                        options={noteTypes}
                        optionKey="description"
                        optionValue="id"
                        id="note_type_fk"
                        name="note_type_fk"
                    />
                </div>

                <div className="grid gap-2">
                    <Date
                        label="Due Date"
                        value={dueDate}
                        onSelect={setDueDate}
                        id="due_date"
                        name="sowing_date"
                    />
                </div>

                <div className="grid gap-2">
                    <textarea
                        id="comments"
                        name="comments"
                        className="border-1 rounded-md"
                        placeholder="Enter comments"
                    />
                </div>
            </div>

            <CardFooter className="flex justify-center py-4 gap-4">
                <Button type="button" variant="outline">
                    Cancel
                </Button>

                <Button type="submit">Add</Button>
            </CardFooter>
        </form>
    );
};

export default memo(ScoutingForm);
