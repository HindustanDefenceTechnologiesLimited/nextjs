/**
 * TypeScript Interfaces for Situational Awareness System
 * Auto-generated from Prisma Schema
 */

// ===================================
// ENUMS
// ===================================

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  OPERATOR = "OPERATOR",
  ANALYST = "ANALYST",
  VIEWER = "VIEWER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum MissionStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export enum SensorType {
  CAMERA = "CAMERA",
  RADAR = "RADAR",
  GPS_TRACKER = "GPS_TRACKER",
  ADS_B = "ADS_B",
  ACOUSTIC = "ACOUSTIC",
  THERMAL = "THERMAL",
  LIDAR = "LIDAR",
  SATELLITE = "SATELLITE",
  WEATHER_STATION = "WEATHER_STATION",
  IOT_SENSOR = "IOT_SENSOR",
  OSINT = "OSINT",
}

export enum SensorStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  MAINTENANCE = "MAINTENANCE",
  ERROR = "ERROR",
}

export enum AssetType {
  DRONE = "DRONE",
  VEHICLE = "VEHICLE",
  AIRCRAFT = "AIRCRAFT",
  VESSEL = "VESSEL",
  GROUND_UNIT = "GROUND_UNIT",
  EQUIPMENT = "EQUIPMENT",
  FACILITY = "FACILITY",
}

export enum AssetStatus {
  AVAILABLE = "AVAILABLE",
  DEPLOYED = "DEPLOYED",
  MAINTENANCE = "MAINTENANCE",
  OFFLINE = "OFFLINE",
}

export enum ObjectiveType {
  REACH_LOCATION = "REACH_LOCATION",
  TASK = "TASK",
  SURVEY = "SURVEY",
  RESCUE = "RESCUE",
  PATROL = "PATROL",
  SECURITY = "SECURITY",
  RECONNAISSANCE = "RECONNAISSANCE",
  SURVEILLANCE = "SURVEILLANCE",
}

export enum TrackType {
  PERSON = "PERSON",
  VEHICLE = "VEHICLE",
  AIRCRAFT = "AIRCRAFT",
  VESSEL = "VESSEL",
  DRONE = "DRONE",
  ANIMAL = "ANIMAL",
  UNKNOWN = "UNKNOWN",
}

export enum TrackStatus {
  ACTIVE = "ACTIVE",
  LOST = "LOST",
  TERMINATED = "TERMINATED",
}

export enum ThreatLevel {
  NONE = "NONE",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum GeofenceType {
  INCLUSION = "INCLUSION",
  EXCLUSION = "EXCLUSION",
  ALERT_ZONE = "ALERT_ZONE",
  RESTRICTED_AREA = "RESTRICTED_AREA",
  SAFE_ZONE = "SAFE_ZONE",
}

export enum AlertType {
  GEOFENCE_VIOLATION = "GEOFENCE_VIOLATION",
  THREAT_DETECTED = "THREAT_DETECTED",
  UNUSUAL_BEHAVIOR = "UNUSUAL_BEHAVIOR",
  SENSOR_OFFLINE = "SENSOR_OFFLINE",
  TRACK_LOST = "TRACK_LOST",
  SYSTEM_ERROR = "SYSTEM_ERROR",
  MANUAL = "MANUAL",
}

export enum AlertSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export enum AlertStatus {
  NEW = "NEW",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  INVESTIGATING = "INVESTIGATING",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
}

export enum EventType {
  MISSION_START = "MISSION_START",
  MISSION_END = "MISSION_END",
  TRACK_CREATED = "TRACK_CREATED",
  TRACK_LOST = "TRACK_LOST",
  ALERT_TRIGGERED = "ALERT_TRIGGERED",
  SENSOR_ONLINE = "SENSOR_ONLINE",
  SENSOR_OFFLINE = "SENSOR_OFFLINE",
  USER_ACTION = "USER_ACTION",
  SYSTEM_EVENT = "SYSTEM_EVENT",
  GEOFENCE_CREATED = "GEOFENCE_CREATED",
  ASSET_DEPLOYED = "ASSET_DEPLOYED",
}

// ===================================
// HELPER TYPES
// ===================================

export interface Coordinates {
  lat: number;
  lng: number;
  altitude?: number;
}

export interface MapCoordinates {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Velocity {
  speed: number; // km/h
  heading: number; // degrees (0-360)
  altitude?: number; // meters
}

export interface Classification {
  size?: string; // 0.0 - 1.0
  subType?: string;
  color?: string;
  attributes?: Record<string, any>;
}

export interface GeoJSONGeometry {
  type: "Point" | "Polygon" | "Circle" | "LineString";
  coordinates: number[] | number[][] | number[][][];
}

// ===================================
// MAIN INTERFACES
// ===================================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional for queries)
  createdMissions?: Mission[];
  assignedAlerts?: Alert[];
  annotations?: Annotation[];
  
}

export interface Mission {
  id: string;
  name: string;
  type: string;
  description?: string;
  startTime: string;
  endTime?: string;
  status: MissionStatus;
  createdById: string;
  mapCoordinates?: MapCoordinates;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;

  // Relations (optional for queries)
  creator?: User;
  sensors?: Sensor[];
  objectives?: Objective[];
  assets?: Asset[];
  events?: Event[];
  tracks?: Track[];
  geofences?: Geofence[];
  alerts?: Alert[];
  annotations?: Annotation[];
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  missionId: string;
  location?: Coordinates;
  ipAddress?: string;
  port?: number;
  streamUrl?: string;
  credentials?: Record<string, any>; // Encrypted
  configuration?: Record<string, any>;
  metadata?: Record<string, any>;
  lastHeartbeat?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional for queries)
  mission?: Mission;
  detections?: Detection[];
  asset?: Asset;
}

export interface Asset {
  id: string;
  missionId: string;
  title: string;
  code: string;
  type: AssetType;
  status: AssetStatus;
  capabilities: string[];
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional for queries)
  mission?: Mission;
  objectiveAllocations?: ObjectiveAllocation[];
  positions?: AssetPosition[];
  sensors?: Sensor[];
}

export interface AssetPosition {
  id: string;
  assetId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  metadata?: Record<string, any>;

  // Relations (optional for queries)
  asset?: Asset;
}

export interface Objective {
  id: string;
  missionId: string;
  title: string;
  type: ObjectiveType;
  description?: string;
  location?: Coordinates & { radius?: number };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional for queries)
  mission?: Mission;
  allocations?: ObjectiveAllocation[];
}

export interface ObjectiveAllocation {
  id: string;
  objectiveId: string;
  assetId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional for queries)
  objective?: Objective;
  asset?: Asset;
}

export interface Track {
  id: string;
  trackId: string; // Unique global identifier
  description?: string;
  type: TrackType;
  status: TrackStatus;
  threatLevel: ThreatLevel;
  missionId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  classification?: Classification;
  velocity?: Velocity;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;

  // Relations (optional for queries)
  mission?: Mission;
  positions?: TrackPosition[];
  detections?: Detection[];
  alerts?: Alert[];
  annotations?: Annotation[];
}

export interface TrackPosition {
  id: string;
  trackId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  metadata?: Record<string, any>;

  // Relations (optional for queries)
  track?: Track;
}

export interface Detection {
  id: string;
  sensorId: string;
  trackId?: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  altitude?: number;
  objectType: string;
  confidence: number; // 0.0 - 1.0
  boundingBox?: BoundingBox;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  rawData?: Record<string, any>;
  metadata?: Record<string, any>;

  // Relations (optional for queries)
  sensor?: Sensor;
  track?: Track;
}

export interface Geofence {
  id: string;
  name: string;
  type: GeofenceType;
  missionId: string;
  geometry: GeoJSONGeometry;
  radius?: number; // meters (if circle)
  altitude?: number; // meters
  isActive: boolean;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional for queries)
  mission?: Mission;
  alerts?: Alert[];
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  missionId?: string;
  trackId?: string;
  geofenceId?: string;
  userId?: string; // Assigned user
  timestamp: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional for queries)
  mission?: Mission;
  track?: Track;
  geofence?: Geofence;
  assignee?: User;
}

export interface Annotation {
  id: string;
  missionId?: string;
  trackId?: string;
  userId: string;
  title: string;
  content: string;
  location?: Coordinates;
  attachments: string[];
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional for queries)
  mission?: Mission;
  track?: Track;
  user?: User;
}

export interface Event {
  id: string;
  type: EventType;
  missionId: string;
  title: string;
  description?: string;
  timestamp: Date;
  location?: Coordinates;
  severity?: string;
  actor?: string; // User or system component
  metadata?: Record<string, any>;

  // Relations (optional for queries)
  mission?: Mission;
}

// ===================================
// CREATE/UPDATE DTOs
// ===================================

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  passwordHash: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface CreateMissionDto {
  name: string;
  type: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  status?: MissionStatus;
  createdById: string;
  mapCoordinates?: MapCoordinates;
  metadata?: Record<string, any>;
}

export interface UpdateMissionDto {
  name?: string;
  type?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  status?: MissionStatus;
  mapCoordinates?: MapCoordinates;
  metadata?: Record<string, any>;
}

export interface CreateSensorDto {
  name: string;
  type: SensorType;
  missionId: string;
  location?: Coordinates;
  ipAddress?: string;
  port?: number;
  streamUrl?: string;
  credentials?: Record<string, any>;
  configuration?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface UpdateSensorDto {
  name?: string;
  status?: SensorStatus;
  location?: Coordinates;
  ipAddress?: string;
  port?: number;
  streamUrl?: string;
  configuration?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface CreateTrackDto {
  // trackId: string;
  description?: string;
  type: TrackType;
  missionId: string;
  threatLevel?: ThreatLevel;
  classification?: Classification;
  velocity?: Velocity;
  metadata?: Record<string, any>;
}

export interface UpdateTrackDto {
  description?: string;
  status?: TrackStatus;
  threatLevel?: ThreatLevel;
  classification?: Classification;
  velocity?: Velocity;
  metadata?: Record<string, any>;
}

export interface CreateTrackPositionDto {
  trackId: string;
  timestamp?: Date;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  metadata?: Record<string, any>;
}

export interface CreateDetectionDto {
  sensorId: string;
  trackId?: string;
  timestamp?: Date;
  latitude: number;
  longitude: number;
  altitude?: number;
  objectType: string;
  confidence: number;
  boundingBox?: BoundingBox;
  imageUrl?: string;
  videoUrl?: string;
  rawData?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface CreateAssetDto {
  missionId: string;
  title: string;
  code: string;
  type: AssetType;
  status?: AssetStatus;
  capabilities: string[];
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateAssetDto {
  title?: string;
  status?: AssetStatus;
  capabilities?: string[];
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreateObjectiveDto {
  missionId: string;
  title: string;
  type: ObjectiveType;
  description?: string;
  location?: Coordinates & { radius?: number };
  metadata?: Record<string, any>;
}

export interface UpdateObjectiveDto {
  title?: string;
  type?: ObjectiveType;
  description?: string;
  location?: Coordinates & { radius?: number };
  metadata?: Record<string, any>;
}

export interface CreateGeofenceDto {
  name: string;
  type: GeofenceType;
  missionId: string;
  geometry: GeoJSONGeometry;
  radius?: number;
  altitude?: number;
  isActive?: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateGeofenceDto {
  name?: string;
  type?: GeofenceType;
  geometry?: GeoJSONGeometry;
  radius?: number;
  altitude?: number;
  isActive?: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreateAlertDto {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  missionId?: string;
  trackId?: string;
  geofenceId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateAlertDto {
  status?: AlertStatus;
  userId?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export interface CreateAnnotationDto {
  missionId?: string;
  trackId?: string;
  userId: string;
  title: string;
  content: string;
  location?: Coordinates;
  attachments?: string[];
  tags?: string[];
  isPrivate?: boolean;
}

export interface UpdateAnnotationDto {
  title?: string;
  content?: string;
  location?: Coordinates;
  attachments?: string[];
  tags?: string[];
  isPrivate?: boolean;
}

export interface CreateEventDto {
  type: EventType;
  missionId: string;
  title: string;
  description?: string;
  timestamp?: Date;
  location?: Coordinates;
  severity?: string;
  actor?: string;
  metadata?: Record<string, any>;
}

// ===================================
// QUERY FILTERS
// ===================================

export interface MissionFilters {
  status?: MissionStatus | MissionStatus[];
  createdById?: string;
  startDate?: Date;
  endDate?: Date;
  type?: string;
}

export interface TrackFilters {
  missionId?: string;
  type?: TrackType | TrackType[];
  status?: TrackStatus | TrackStatus[];
  threatLevel?: ThreatLevel | ThreatLevel[];
  lastSeenAfter?: Date;
  lastSeenBefore?: Date;
}

export interface AlertFilters {
  missionId?: string;
  status?: AlertStatus | AlertStatus[];
  severity?: AlertSeverity | AlertSeverity[];
  type?: AlertType | AlertType[];
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface SensorFilters {
  missionId?: string;
  type?: SensorType | SensorType[];
  status?: SensorStatus | SensorStatus[];
}

export interface DetectionFilters {
  sensorId?: string;
  trackId?: string;
  objectType?: string;
  minConfidence?: number;
  startDate?: Date;
  endDate?: Date;
}

// ===================================
// RESPONSE TYPES
// ===================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ===================================
// REAL-TIME WEBSOCKET EVENTS
// ===================================

export interface WebSocketEvent {
  type: string;
  timestamp: Date;
  data: any;
}

export interface TrackUpdateEvent extends WebSocketEvent {
  type: "TRACK_UPDATE";
  data: {
    trackId: string;
    position: TrackPosition;
    track: Track;
  };
}

export interface AlertCreatedEvent extends WebSocketEvent {
  type: "ALERT_CREATED";
  data: Alert;
}

export interface SensorStatusEvent extends WebSocketEvent {
  type: "SENSOR_STATUS";
  data: {
    sensorId: string;
    status: SensorStatus;
    timestamp: Date;
  };
}

export interface DetectionEvent extends WebSocketEvent {
  type: "DETECTION";
  data: Detection;
}