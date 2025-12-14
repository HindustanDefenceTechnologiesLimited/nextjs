'use client'
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable, DataGridTableRowSelect, DataGridTableRowSelectAll, } from '@/components/ui/data-grid-table';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, Row, SortingState, useReactTable, } from '@tanstack/react-table';
import { Ellipsis, Filter, ScanIcon, Search, UserRoundPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Geofence } from '@/lib/types';
import { useAppDispatch } from '@/store/hook';
import { setSidebarData, setSidebarType } from '@/store/slices/sidebarSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Separator } from '@/components/ui/separator';
import { PopoverClose } from '@radix-ui/react-popover';
import { setMapData, setMapType } from '@/store/slices/mapSlice';
import { usePathname, useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch"





function ActionsCell({ row }: { row: Row<Geofence> }) {
    const { copy } = useCopyToClipboard();
    const handleCopyId = () => {
        copy(row.original.id);
        const message = `Geofence ID successfully copied: ${row.original.id}`;
        toast.info(message);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="" size='icon' variant="ghost">
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem onClick={() => { }}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => { }}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function GeofenceTable({ geofences = [] }: { geofences: Geofence[] }) {


    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });
    const dispatch = useAppDispatch();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: true }]);
    const [searchQuery, setSearchQuery] = useState('');
    // const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(true);

    const filteredData = useMemo(() => {
        return geofences.filter((item) => {
            // Filter by status
            // const matchesStatus = item.isActive === isActive;

            // Filter by search query (case-insensitive)
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                !searchQuery ||
                Object.values(item)
                    .join(' ') // Combine all fields into a single string
                    .toLowerCase()
                    .includes(searchLower);

            return matchesSearch;
        });
    }, [searchQuery, isActive, geofences]);




    const columns = useMemo<ColumnDef<Geofence>[]>(
        () => [
            {
                accessorKey: 'id',
                id: 'id',
                header: () => <DataGridTableRowSelectAll />,
                cell: ({ row }) => <DataGridTableRowSelect row={row} />,
                enableSorting: false,
                size: 35,
                meta: {
                    headerClassName: '',
                    cellClassName: '',
                },
                enableResizing: false,

            },
            {
                accessorKey: 'name',
                id: 'name',
                header: ({ column }) => <DataGridColumnHeader title="Name" visibility={true} column={column} />,

                cell: ({ row }) => {
                    return (
                       row.original.name
                    );
                },
                enableSorting: true,
                enableHiding: false,
                enableResizing: true,
            },
            {
                accessorKey: 'type',
                id: 'type',
                header: ({ column }) => <DataGridColumnHeader title="Threat" visibility={true} column={column} />,
                cell: ({ row }) => {
                    return (
                        row.original.type
                    );
                },

                meta: {
                    headerClassName: '',
                    cellClassName: 'text-start',
                },
                enableSorting: true,
                enableHiding: true,
                enableResizing: true,
            },
            {
                accessorKey: 'geometry',
                id: 'geometry',
                header: ({ column }) => <DataGridColumnHeader title="Geometry" visibility={true} column={column} />,
                cell: ({ row }) => {
                    return (
                       row.original.geometry.shapeType
                    );
                },

                meta: {
                    headerClassName: '',
                    cellClassName: 'text-start',
                },
                enableSorting: true,
                enableHiding: true,
                enableResizing: true,
                size: 100,

            },
            {
                accessorKey: 'isActive',
                id: 'isActive',
                header: ({ column }) => <DataGridColumnHeader title="Active" visibility={true} column={column} />,
                cell: ({ row }) => {
                    return (
                        row.original.isActive ? 'True' : 'False'
                    );
                },

                meta: {
                    headerClassName: '',
                    cellClassName: 'text-start',
                },
                enableSorting: true,
                enableHiding: true,
                enableResizing: true,
                size: 100,

            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => <ActionsCell row={row} />,
                size: 50,
                enableSorting: false,
                enableHiding: false,
                enableResizing: false,
            },
        ],
        [],
    );

    const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

    const table = useReactTable({
        columns,
        data: filteredData || [],
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row: Geofence) => row.id,
        state: {
            pagination,
            sorting,
            columnOrder,
        },
        columnResizeMode: 'onChange',
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <DataGrid
            table={table}
            recordCount={filteredData?.length || 0}
            tableClassNames={{
                bodyRow: 'max-h-8'

            }}

            tableLayout={{
                columnsPinnable: true,
                columnsResizable: true,
                columnsMovable: true,
                columnsVisibility: true,
                dense: true,
            }}
        >
            <Card className="py-4 gap-2">
                <CardHeader className="px-4">
                    <CardTitle>
                        <div className="flex items-center justify-between gap-2.5">
                            <p className='text-lg flex items-center gap-2'>
                                <ScanIcon className='w-5 h-5' />
                                Geofences</p>
                            <div className="relative">
                                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="ps-9 w-80"
                                />
                                {searchQuery.length > 0 && (
                                    <Button
                                        size='icon'
                                        variant="ghost"
                                        className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <X />
                                    </Button>
                                )}
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                <Switch id="isActive" checked={isActive} onCheckedChange={(value) => setIsActive(value)} />
                                <Label htmlFor="isActive">Active</Label>
                            </div> */}
                        </div>
                    </CardTitle>
                </CardHeader>
               <CardContent className='px-4 max-h-[40vh] overflow-y-auto relative'>
                        <DataGridTable />
                </CardContent>
                <CardFooter>
                    <DataGridPagination />
                </CardFooter>
            </Card>
        </DataGrid>
    );
}


