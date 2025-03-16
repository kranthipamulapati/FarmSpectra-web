import { memo } from "react";
import { Menu, ChevronRight, ChevronLeft } from "lucide-react";

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
            className="h-9 w-9"
            onClick={toggleSidebar}
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
