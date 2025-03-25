import { memo, useCallback } from "react";

import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";

const OrganizationForm = () => {
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
        (e) => {},
        []
    );

    return (
        <Card className="w-full max-w-[600px] rounded-none py-4">
            <form onSubmit={handleSubmit}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>New Organization</CardTitle>

                    <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <Separator className="my-2" />

                <div className="grid gap-6 px-6 py-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>

                            <Input
                                minLength={3}
                                maxLength={4}
                                required={true}
                                id="code"
                                name="code"
                                placeholder="Enter code"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                minLength={3}
                                maxLength={50}
                                id="name"
                                name="name"
                                required={true}
                                placeholder="Enter name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>

                            <Input
                                minLength={4}
                                maxLength={4}
                                required={true}
                                id="email"
                                name="email"
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                minLength={3}
                                maxLength={50}
                                id="name"
                                name="name"
                                required={true}
                                placeholder="Enter name"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default memo(OrganizationForm);
