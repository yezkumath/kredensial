
"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getBreadcrumbSegments } from "@/components/fungtionBreadcrumbSegments"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

export function AppBreadcrumb() {
    const pathname = usePathname()
    const segments = getBreadcrumbSegments(pathname)
    return (
        <Breadcrumb className="p-4 rounded-md shadow-md mx-4 my-2 bg-sidebar">
            <BreadcrumbList>
                <SidebarTrigger />
                {segments.map((segment, index) => (
                    <React.Fragment key={segment.href}>
                        <BreadcrumbItem>
                            {
                                segment.disabled ? (
                                    // Render as plain text if disabled
                                    <span className="text-gray-500">{segment.name}</span>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={segment.href}
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900">{segment.name}</Link>
                                    </BreadcrumbLink>
                                )
                            }
                        </BreadcrumbItem>
                        {index < segments.length - 1 && (
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}