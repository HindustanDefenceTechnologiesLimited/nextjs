import FileList from '@/components/file/file-list';
import UploadFilesDialog from '@/components/file/upload-files-dialog';
import { Button } from '@/components/ui/button';
import api from '@/lib/auth';
import { File, Track } from '@/lib/types';
import { useAppDispatch } from '@/store/hook';
import { setError, setLoading, updateTrack } from '@/store/slices/missionSlice';
import { RootState } from '@/store/store';
import React, { useEffect, useMemo } from 'react';
import { useAppSelector } from '@/store/hook';

type Props = {
    track: Track;
};

const TrackFiles = ({ track }: Props) => {
    const dispatch = useAppDispatch();

    const currentTrack = useAppSelector((state: RootState) =>
        state.mission.data.tracks?.find((t) => t.id === track.id)
    );

    const files = currentTrack?.files || [];
    // useEffect(() => {
    //     const fetchTrackFiles = async () => {
    //         try {
    //             dispatch(setLoading(true));

    //             const response = await api.post(`/api/file/track/${track.id}`);
    //             dispatch(
    //                 updateTrack({
    //                     id: track.id,
    //                     files: response.data.data,
    //                 })
    //             );

    //         } catch (error) {
    //             dispatch(setError("Failed to fetch track files"));
    //         } finally {
    //             dispatch(setLoading(false));
    //         }
    //     };

    //     fetchTrackFiles();
    // }, [track.id, dispatch]);

    const handleUploaded = (uploaded: File[]) => {
        if (!uploaded.length) return;

        dispatch(
            updateTrack({
                id: track.id,
                files: [...files, ...uploaded], // merge with actual redux files, not props
            })
        );
    };

    return (
        <div>
            <FileList files={files} />
            <UploadFilesDialog
                parentId={track.id}
                parentType="TRACK"
                onUpload={handleUploaded}>
                <Button className="w-full" variant='outline' >Upload Files</Button>
            </UploadFilesDialog>
        </div>
    );
};


export default TrackFiles;
