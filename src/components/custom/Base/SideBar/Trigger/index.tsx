import { memo } from "react";
import { ChevronLeft, ChevronRight, Menu} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const SideBarTrigger = () => {
    const isMobile = useIsMobile();
    const { state, toggleSidebar } = useSidebar();

    return (
        <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 p-6 "
        onClick={toggleSidebar}
        title={
            !isMobile
                ? state === "collapsed"
                    ? "Expand Sidebar"
                    : "Collapse Sidebar"
                : ""
        }
    >
        {isMobile ? (
            <Menu className="h-5 w-5" />
        ) : state === "collapsed" ? (
            <ChevronRight className="h-5 w-5" />
        ) : (
            <ChevronLeft className="h-5 w-5" />
        )}
       
    </Button>
    );
};

export default memo(SideBarTrigger);
