// store/slices/missionSlice.ts
import {
  Alert,
  Annotation,
  Asset,
  Geofence,
  Mission,
  MissionStatus,
  Objective,
  Track,
} from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MissionState = {
  data: Mission;
  loading: boolean;
  error?: string | null;
};

const initialState: MissionState = {
  data: {
    id: "",
    name: "",
    type: "",
    startTime: "",
    status: MissionStatus.NEW,
    createdById: "",
    createdAt: "",
    updatedAt: "",
  },
  loading: false,
  error: null,
};

const missionsSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    setMission(state, action: PayloadAction<Mission>) {
      state.data = action.payload;
    },
    updateMission(state, action: PayloadAction<Partial<Mission>>) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    addTrack(state, action: PayloadAction<Track>) {
      state.data.tracks?.unshift(action.payload);
    },
    addAsset(state, action: PayloadAction<Asset>) {
      state.data.assets?.unshift(action.payload);
    },
    addAnnotation(state, action: PayloadAction<Annotation>) {
      state.data.annotations?.unshift(action.payload);
    },
    addGeofence(state, action: PayloadAction<Geofence>) {
      state.data.geofences?.push(action.payload);
    },
    addObjective(state, action: PayloadAction<Objective>) {
      state.data.objectives?.push(action.payload);
    },
    updateAsset(state, action: PayloadAction<Partial<Asset> & { id: string }>) {
      const assetId = action.payload.id;
      state.data.assets = state.data.assets?.map((asset) => {
        if (asset.id === assetId) {
          return {
            ...asset,
            ...action.payload,
          };
        }
        return asset;
      });
    },
    updateTrack(state, action: PayloadAction<Partial<Track> & { id: string }>) {
      const trackId = action.payload.id;
      state.data.tracks = state.data.tracks?.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            ...action.payload,
          };
        }
        return track;
      });
    },
    updateAlert(state, action: PayloadAction<Partial<Alert> & { id: string }>) {
      const alertId = action.payload.id;
      state.data.alerts = state.data.alerts?.map((alert) => {
        if (alert.id === alertId) {
          return {
            ...alert,
            ...action.payload,
          };
        }
        return alert;
      });
    },
    updateAnnotation(
      state,
      action: PayloadAction<Partial<Annotation> & { id: string }>
    ) {
      const annotationId = action.payload.id;
      state.data.annotations = state.data.annotations?.map((annotation) => {
        if (annotation.id === annotationId) {
          return {
            ...annotation,
            ...action.payload,
          };
        }
        return annotation;
      });
    },
    updateObjective(state, action: PayloadAction<Partial<Objective>>) {
      const objectiveId = action.payload.id;
      state.data.objectives = state.data.objectives?.map((objective) => {
        if (objective.id === objectiveId) {
          return {
            ...objective,
            ...action.payload,
          };
        }
        return objective;
      });
    },
    deleteGeofence(state, action: PayloadAction<string>) {
      state.data.geofences = state.data.geofences?.filter(
        (geofence) => geofence.id !== action.payload
      );
    },
    deleteAnnotation(state, action: PayloadAction<string>) {
      state.data.annotations = state.data.annotations?.filter(
        (annotation) => annotation.id !== action.payload
      );
    },
  },
});

export const {
  setMission,
  setLoading,
  setError,
  updateTrack,
  addGeofence,
  deleteGeofence,
  updateMission,
  addTrack,
  addAsset,
  updateAsset,
  updateAlert,
  addAnnotation,
  updateAnnotation,
  deleteAnnotation,
  updateObjective,
  addObjective,
} = missionsSlice.actions;
export default missionsSlice.reducer;
