import { memo } from "react";

import Header from "@/components/custom/base/Header";
import OrganizationForm from "@/components/custom/Organization/Form";

const AdminDashboard = () => {
    return (
        <>
            <Header />

            <div className="flex-1 flex items-center justify-center">
                <OrganizationForm />
            </div>
        </>
    );
};

export default memo(AdminDashboard);
