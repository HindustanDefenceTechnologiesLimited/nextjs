'use client'
import { useEffect, useMemo, useState } from 'react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
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
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, Row, RowSelectionState, SortingState, useReactTable, } from '@tanstack/react-table';
import { ChevronDownIcon, Ellipsis, Filter, RouteIcon, Search, UserRoundPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Track } from '@/lib/types';
import { useAppDispatch } from '@/store/hook';
import { setSidebarData, setSidebarType } from '@/store/slices/sidebarSlice';
import { useAppSelector } from '@/store/hook';
import { RootState } from '@/store/store';
import { se } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { PopoverClose } from '@radix-ui/react-popover';
import { setMapData, setMapType } from '@/store/slices/mapSlice';
import { usePathname, useRouter } from 'next/navigation';
import { json2csv } from 'json-2-csv';





function ActionsCell({ row }: { row: Row<Track> }) {
    const { copy } = useCopyToClipboard();
    const handleCopyId = () => {
        copy(row.original.id);
        const message = `Track ID successfully copied: ${row.original.id}`;
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

export default function TrackTable({ tracks = [] }: { tracks: Track[] }) {
    const router = useRouter();
    const pathname = usePathname()

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });
    const dispatch = useAppDispatch();
    const sidebarType = useAppSelector((state: RootState) => state.sidebar.type);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: true }]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [selectedRowsData, setSelectedRowsData] = useState<Track[]>([]);

    const filteredData = useMemo(() => {
        return tracks.filter((item) => {
            // Filter by status
            const matchesStatus = !selectedStatuses?.length || selectedStatuses.includes(item.status);

            // Filter by search query (case-insensitive)
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                !searchQuery ||
                Object.values(item)
                    .join(' ') // Combine all fields into a single string
                    .toLowerCase()
                    .includes(searchLower);

            return matchesStatus && matchesSearch;
        });
    }, [searchQuery, selectedStatuses, tracks]);

    const statusCounts = useMemo(() => {
        if (!tracks.length) return {};
        return tracks.reduce(
            (acc, item) => {
                acc[item.status] = (acc[item.status] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );
    }, [tracks]);

    const handleStatusChange = (checked: boolean, value: string) => {
        setSelectedStatuses(
            (
                prev = [], // Default to an empty array
            ) => (checked ? [...prev, value] : prev.filter((v) => v !== value)),
        );
    };

    const downloadCSV = (data: any, fileName: string) => {
        const csv = json2csv(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName + '.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const columns = useMemo<ColumnDef<Track>[]>(
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
                accessorKey: 'track-id',
                id: 'name',
                header: ({ column }) => <DataGridColumnHeader title="Track ID" visibility={true} column={column} />,

                cell: ({ row }) => {
                    return (
                        // <div className="font-medium text-foreground">{row.original.trackId}</div>
                        row.original.trackId
                    );
                },
                enableSorting: true,
                enableHiding: false,
                enableResizing: true,
            },
            {
                accessorKey: 'threatLevel',
                id: 'threatLevel',
                header: ({ column }) => <DataGridColumnHeader title="Threat" visibility={true} column={column} />,
                cell: ({ row }) => {
                    return (
                        row.original.threatLevel
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
                accessorKey: 'positions',
                id: 'positions',
                header: ({ column }) => <DataGridColumnHeader title="Last Position" visibility={true} column={column} />,
                cell: ({ row }) => {
                    const lastPosition = row.original.positions && row.original.positions[0]
                    const long = lastPosition && lastPosition.longitude;
                    const lat = lastPosition && lastPosition.latitude;
                    return (
                        <div className="flex items-center gap-1.5">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" aria-label="Open Popover" className='font-normal underline' onClick={(e) => { e.stopPropagation() }}>
                                        {long && lat && `${long.toFixed(5)}, ${lat.toFixed(5)}`}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="rounded-xl p-0 text-sm">
                                    <div className="px-4 py-3">
                                        <div className="text-sm font-medium">Do you want to view this location?</div>
                                    </div>
                                    <Separator />
                                    <div className="p-4 text-sm *:[p:not(:last-child)]:mb-2">
                                        <PopoverClose asChild>
                                            <Button size='sm'
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (lastPosition) {
                                                        dispatch(setMapType('trackPosition'));
                                                        dispatch(setMapData(lastPosition));
                                                    }
                                                    const mapRoute = pathname.split('/')
                                                    router.push('/' + mapRoute[1] + '/' + mapRoute[2])
                                                }}
                                            >
                                                Yes
                                            </Button>
                                        </PopoverClose>
                                        <PopoverClose asChild>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                }}
                                                variant='ghost' size='sm'>No</Button>
                                        </PopoverClose>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            {!long && !lat && 'N/A'}
                        </div>
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
                accessorKey: 'type',
                id: 'type',
                header: ({ column }) => <DataGridColumnHeader title="Type" visibility={true} column={column} />,
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
                size: 100,

            },
            {
                accessorKey: 'classification',
                id: 'classification',
                header: ({ column }) => <DataGridColumnHeader title="Sub Type" visibility={true} column={column} />,
                cell: ({ row }) => {
                    return (
                        row.original.classification?.subType
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
                accessorKey: 'status',
                id: 'status',
                header: ({ column }) => <DataGridColumnHeader title="Status" visibility={true} column={column} />,
                cell: ({ row }) => {
                    const status = row.original.status;

                    if (status == 'ACTIVE') {
                        return (
                            <Badge variant="default" className='bg-green-700 text-white'>
                                Active
                            </Badge>
                        );
                    } else if (status == 'LOST') {
                        return (
                            <Badge variant="destructive" >
                                Lost
                            </Badge>
                        );
                    } else {
                        return (
                            <Badge variant="secondary" >
                                Terminated
                            </Badge>
                        );
                    }
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
        getRowId: (row: Track) => row.id,
        state: {
            pagination,
            sorting,
            columnOrder,
            rowSelection
        },
        columnResizeMode: 'onChange',
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,

    });


    useEffect(() => {
        const rows = table.getSelectedRowModel().flatRows.map((row) => row.original);
        setSelectedRowsData(rows);
    }, [rowSelection, table]);
    return (
        <DataGrid
            table={table}
            recordCount={filteredData?.length || 0}
            tableClassNames={{
                bodyRow: 'max-h-8'

            }}
            // TODO: Figure out this sidebar rendering, currently it is patch
            // TODO: Done
            onRowClick={(row) => {
                dispatch(setSidebarType('track'));
                dispatch(setSidebarData(row));
            }}
            tableLayout={{
                columnsPinnable: true,
                columnsResizable: true,
                columnsMovable: true,
                columnsVisibility: true,
                dense: true,
            }}
        >
            <Card className="py-4 gap-2 font-normal">
                <CardHeader className="px-4">
                    <CardTitle>
                        <div className="flex items-center gap-2.5">
                            <p className="text-lg flex items-center gap-2">
                                <RouteIcon className='w-5 h-5' />
                                Tracks</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className='ml-auto'>
                                        <Filter />
                                        Status
                                        {selectedStatuses.length > 0 && (
                                            <Badge>
                                                {selectedStatuses.length}
                                            </Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-40 p-3" align="start">
                                    <div className="space-y-3">
                                        <div className="text-xs font-medium text-muted-foreground">Filters</div>
                                        <div className="space-y-3">
                                            {Object.keys(statusCounts).map((status) => (
                                                <div key={status} className="flex items-center gap-2.5">
                                                    <Checkbox
                                                        id={status}
                                                        checked={selectedStatuses.includes(status)}
                                                        onCheckedChange={(checked) => handleStatusChange(checked === true, status)}
                                                    />
                                                    <Label
                                                        htmlFor={status}
                                                        className="grow flex items-center justify-between font-normal gap-1.5"
                                                    >
                                                        {status}
                                                        <span className="text-muted-foreground">{statusCounts[status]}</span>
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
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
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button size='icon' variant="secondary">
                                        <ChevronDownIcon className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => downloadCSV(tracks, 'All_Tracks')}>Save all rows (csv)</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => downloadCSV(selectedRowsData, 'Selected_Tracks')}>Save selected rows (csv)</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => downloadCSV(filteredData, 'Filtered_Tracks')}>Save filtered rows (csv)</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className='px-4 max-h-[40vh] overflow-y-auto relative'>
                    <DataGridTable />
                </CardContent>
                <CardFooter>
                    <DataGridPagination />
                    <p className="text-sm text-muted-foreground ml-4">{selectedRowsData.length} row(s) selected</p>

                </CardFooter>
            </Card>
        </DataGrid>
    );
}


