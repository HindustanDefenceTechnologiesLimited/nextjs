export const serverURL = "http://localhost:5000";

export const MISSION_TYPES = [
    { value: "ground", label: "Ground Combat" },
    { value: "air", label: "Air Combat" },
    { value: "navy", label: "Navy Combat" },
    { value: "submarine", label: "Submarine Combat" },
    { value: "search", label: "Search" },
    { value: "patrol", label: "Patrol" },
    { value: "escort", label: "Escort" },
    { value: "intercept", label: "Intercept" },
    { value: "interdict", label: "Interdict" },
    { value: "strike", label: "Strike" },
    { value: "bombing", label: "Bombing" },
    { value: "recon", label: "Recon" },
    { value: "recovery", label: "Recovery" },
    { value: "transport", label: "Transport" },
    { value: "supply", label: "Supply" },
] as const;


export const TRACK_HIRARCHY = {
  "PERSON": {
    "subtypes": [
      {
        "name": "Civilian Adult",
        "attributes": {
          "gender": {
            "type": "enum",
            "options": ["Male", "Female", "Non-binary", "Other"],
            "required": true
          },
          "ageGroup": {
            "type": "enum",
            "options": ["18-30", "31-50", "51+"],
            "required": true
          },
          "clothing": {
            "type": "string",
            "description": "Description of attire (e.g., casual, business)",
            "required": false
          },
          "accessories": {
            "type": "array",
            "items": "string",
            "description": "Items like bags, hats, jewelry",
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Calm", "Agitated", "Running", "Standing"],
            "required": false
          },
          "identification": {
            "type": "object",
            "properties": {
              "idType": {"type": "enum", "options": ["Passport", "ID Card", "Driver License"]},
              "number": {"type": "string"}
            },
            "required": false
          }
        }
      },
      {
        "name": "Civilian Elderly",
        "attributes": {
          "gender": {
            "type": "enum",
            "options": ["Male", "Female", "Non-binary", "Other"],
            "required": true
          },
          "ageGroup": {
            "type": "enum",
            "options": ["65-75", "76-85", "86+"],
            "required": true
          },
          "clothing": {
            "type": "string",
            "description": "Description of attire",
            "required": false
          },
          "mobilityAid": {
            "type": "enum",
            "options": ["Cane", "Walker", "Wheelchair", "None"],
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Slow Moving", "Resting", "Active", "Confused"],
            "required": false
          },
          "medicalAlert": {
            "type": "boolean",
            "description": "Visible medical alert jewelry",
            "required": false
          }
        }
      },
      {
        "name": "Civilian Teen",
        "attributes": {
          "gender": {
            "type": "enum",
            "options": ["Male", "Female", "Non-binary", "Other"],
            "required": true
          },
          "ageGroup": {
            "type": "enum",
            "options": ["13-15", "16-17"],
            "required": true
          },
          "clothing": {
            "type": "string",
            "description": "Description of attire (e.g., casual, school uniform)",
            "required": false
          },
          "backpack": {
            "type": "boolean",
            "description": "Carrying backpack?",
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Socializing", "On Phone", "Walking", "Running"],
            "required": false
          },
          "deviceUsage": {
            "type": "enum",
            "options": ["Smartphone", "Tablet", "Headphones", "None"],
            "required": false
          }
        }
      },
      {
        "name": "Civilian Child",
        "attributes": {
          "gender": {
            "type": "enum",
            "options": ["Male", "Female", "Non-binary", "Other"],
            "required": true
          },
          "ageGroup": {
            "type": "enum",
            "options": ["0-5", "6-12", "13-17"],
            "required": true
          },
          "clothing": {
            "type": "string",
            "description": "Description of attire (e.g., school uniform)",
            "required": false
          },
          "accompanyingAdult": {
            "type": "boolean",
            "description": "Is with an adult?",
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Playing", "Crying", "Walking"],
            "required": false
          },
          "toyOrItem": {
            "type": "string",
            "description": "Carrying toy or personal item",
            "required": false
          }
        }
      },
      {
        "name": "Law Enforcement",
        "attributes": {
          "uniformType": {
            "type": "enum",
            "options": ["Patrol", "Tactical", "Traffic", "Plain Clothes"],
            "required": true
          },
          "badgeNumber": {
            "type": "string",
            "required": false
          },
          "vehicleAssociation": {
            "type": "string",
            "description": "Associated patrol vehicle",
            "required": false
          },
          "weapon": {
            "type": "enum",
            "options": ["Sidearm", "Rifle", "Shotgun", "Taser", "None"],
            "required": false
          },
          "rank": {
            "type": "enum",
            "options": ["Officer", "Sergeant", "Lieutenant", "Captain", "Chief"],
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "description": "Identification Friend or Foe",
            "required": false
          }
        }
      },
      {
        "name": "Military Personnel",
        "attributes": {
          "rank": {
            "type": "enum",
            "options": ["Private", "Sergeant", "Lieutenant", "Captain", "Major", "Colonel", "General"],
            "required": true
          },
          "branch": {
            "type": "enum",
            "options": ["Army", "Navy", "Air Force", "Marines", "Coast Guard"],
            "required": true
          },
          "uniformType": {
            "type": "enum",
            "options": ["Combat", "Dress", "Fatigues"],
            "required": true
          },
          "weapons": {
            "type": "array",
            "items": "string",
            "description": "Visible weapons (e.g., M4 Rifle, Sidearm)",
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "description": "Identification Friend or Foe",
            "required": false
          },
          "unit": {
            "type": "string",
            "description": "Unit affiliation",
            "required": false
          }
        }
      },
      {
        "name": "Insurgent/Combatant",
        "attributes": {
          "affiliation": {
            "type": "enum",
            "options": ["Insurgent", "Terrorist", "Militia"],
            "required": true
          },
          "attire": {
            "type": "enum",
            "options": ["Civilian Blend", "Tactical Gear", "Improvised"],
            "required": true
          },
          "weapons": {
            "type": "array",
            "items": "string",
            "description": "Armed with (e.g., AK-47, IED Vest)",
            "required": true
          },
          "behavior": {
            "type": "enum",
            "options": ["Evading", "Aggressive", "Scouting"],
            "required": false
          },
          "marks": {
            "type": "string",
            "description": "Tattoos or scars indicating group",
            "required": false
          }
        }
      },
      {
        "name": "Medical Personnel",
        "attributes": {
          "role": {
            "type": "enum",
            "options": ["Doctor", "Nurse", "Medic", "Paramedic"],
            "required": true
          },
          "uniform": {
            "type": "enum",
            "options": ["Red Cross", "Military Medical", "Civilian"],
            "required": true
          },
          "equipment": {
            "type": "array",
            "items": "string",
            "description": "Medical kit, stretcher, etc.",
            "required": false
          },
          "protectedStatus": {
            "type": "boolean",
            "description": "Under Geneva Convention protection",
            "required": false
          }
        }
      },
      {
        "name": "Journalist",
        "attributes": {
          "accreditation": {
            "type": "enum",
            "options": ["Official", "Embedded", "Freelance", "None"],
            "required": true
          },
          "equipment": {
            "type": "array",
            "items": "string",
            "description": "Camera, microphone, press pass",
            "required": false
          },
          "clothing": {
            "type": "string",
            "description": "Press vest, casual attire",
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Filming", "Interviewing", "Observing"],
            "required": false
          },
          "vehicle": {
            "type": "string",
            "description": "Press vehicle identification",
            "required": false
          }
        }
      },
      {
        "name": "Contractor",
        "attributes": {
          "company": {
            "type": "string",
            "description": "Contracting company name",
            "required": true
          },
          "uniform": {
            "type": "enum",
            "options": ["Company Logo", "Tactical", "Civilian"],
            "required": true
          },
          "tools": {
            "type": "array",
            "items": "string",
            "description": "Equipment being used",
            "required": false
          },
          "accessLevel": {
            "type": "enum",
            "options": ["Restricted", "Escorted", "Unrestricted"],
            "required": false
          },
          "vehicle": {
            "type": "string",
            "description": "Company vehicle identification",
            "required": false
          }
        }
      },
      {
        "name": "Refugee",
        "attributes": {
          "groupSize": {
            "type": "integer",
            "description": "Number in group",
            "required": true
          },
          "clothing": {
            "type": "string",
            "description": "Condition and type of clothing",
            "required": false
          },
          "possessions": {
            "type": "array",
            "items": "string",
            "description": "Bags, carts, personal items",
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Moving", "Resting", "Seeking Aid", "Panicked"],
            "required": false
          },
          "destination": {
            "type": "string",
            "description": "Apparent direction of travel",
            "required": false
          }
        }
      }
    ]
  },
  "VEHICLE": {
    "subtypes": [
      {
        "name": "Sedan",
        "attributes": {
          "color": {
            "type": "string",
            "required": true
          },
          "makeModel": {
            "type": "string",
            "description": "e.g., Toyota Camry",
            "required": true
          },
          "licensePlate": {
            "type": "string",
            "required": false
          },
          "occupants": {
            "type": "integer",
            "description": "Estimated number",
            "required": false
          },
          "modifications": {
            "type": "array",
            "items": "string",
            "description": "Tinted windows, roof rack",
            "required": false
          }
        }
      },
      {
        "name": "SUV",
        "attributes": {
          "color": {
            "type": "string",
            "required": true
          },
          "makeModel": {
            "type": "string",
            "required": true
          },
          "licensePlate": {
            "type": "string",
            "required": false
          },
          "roofLoad": {
            "type": "boolean",
            "description": "Cargo on roof?",
            "required": false
          },
          "towing": {
            "type": "boolean",
            "description": "Trailer attached?",
            "required": false
          }
        }
      },
      {
        "name": "Truck",
        "attributes": {
          "color": {
            "type": "string",
            "required": true
          },
          "makeModel": {
            "type": "string",
            "required": true
          },
          "bedLoad": {
            "type": "string",
            "description": "Cargo description (e.g., supplies, troops)",
            "required": false
          },
          "licensePlate": {
            "type": "string",
            "required": false
          },
          "trailerType": {
            "type": "enum",
            "options": ["Flatbed", "Enclosed", "None"],
            "required": false
          }
        }
      },
      {
        "name": "Motorcycle",
        "attributes": {
          "color": {
            "type": "string",
            "required": true
          },
          "makeModel": {
            "type": "string",
            "required": true
          },
          "licensePlate": {
            "type": "string",
            "required": false
          },
          "riderGear": {
            "type": "enum",
            "options": ["Helmet Only", "Full Gear", "No Gear"],
            "required": false
          },
          "sidecar": {
            "type": "boolean",
            "description": "Has sidecar?",
            "required": false
          }
        }
      },
      {
        "name": "Bus",
        "attributes": {
          "color": {
            "type": "string",
            "required": true
          },
          "makeModel": {
            "type": "string",
            "required": true
          },
          "licensePlate": {
            "type": "string",
            "required": false
          },
          "passengerCount": {
            "type": "integer",
            "description": "Estimated passengers",
            "required": false
          },
          "routeSign": {
            "type": "string",
            "description": "Destination or route number",
            "required": false
          }
        }
      },
      {
        "name": "Van",
        "attributes": {
          "color": {
            "type": "string",
            "required": true
          },
          "makeModel": {
            "type": "string",
            "required": true
          },
          "licensePlate": {
            "type": "string",
            "required": false
          },
          "cargoType": {
            "type": "string",
            "description": "Visible cargo description",
            "required": false
          },
          "windows": {
            "type": "enum",
            "options": ["Tinted", "Clear", "No Windows"],
            "required": false
          }
        }
      },
      {
        "name": "Armored Personnel Carrier (APC)",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Wheeled", "Tracked"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "description": "Country of origin",
            "required": true
          },
          "markings": {
            "type": "string",
            "description": "Camouflage, unit insignia",
            "required": false
          },
          "weaponry": {
            "type": "array",
            "items": "string",
            "description": "Mounted guns, turrets",
            "required": false
          },
          "troopCapacity": {
            "type": "integer",
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "required": false
          }
        }
      },
      {
        "name": "Tank",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Main Battle", "Light"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "armorType": {
            "type": "enum",
            "options": ["Composite", "Reactive"],
            "required": false
          },
          "mainArmament": {
            "type": "string",
            "description": "e.g., 120mm gun",
            "required": false
          },
          "crewSize": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Humvee/MRAP",
        "attributes": {
          "variant": {
            "type": "enum",
            "options": ["Standard", "Armored", "Ambulance"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "weaponMount": {
            "type": "enum",
            "options": ["Machine Gun", "Missile Launcher", "None"],
            "required": false
          },
          "licensePlate": {
            "type": "string",
            "required": false
          }
        }
      },
      {
        "name": "Armored Truck",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Cash Transport", "Prisoner Transport", "Military Cargo"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "armorLevel": {
            "type": "enum",
            "options": ["Light", "Medium", "Heavy"],
            "required": false
          },
          "weaponry": {
            "type": "array",
            "items": "string",
            "description": "Defensive weapons",
            "required": false
          },
          "cargo": {
            "type": "string",
            "description": "Suspected cargo type",
            "required": false
          }
        }
      },
      {
        "name": "Logistics Truck",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Fuel", "Ammunition", "Supplies", "General Cargo"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "cargoType": {
            "type": "string",
            "description": "Specific cargo if visible",
            "required": false
          },
          "convoyPosition": {
            "type": "string",
            "description": "Position in convoy",
            "required": false
          },
          "markings": {
            "type": "string",
            "description": "Unit markings, identification",
            "required": false
          }
        }
      },
      {
        "name": "Bicycle",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Mountain", "Road", "Utility", "Electric"],
            "required": true
          },
          "color": {
            "type": "string",
            "required": true
          },
          "riderCount": {
            "type": "integer",
            "description": "Number of riders",
            "required": false
          },
          "cargo": {
            "type": "string",
            "description": "Baskets, packages, etc.",
            "required": false
          },
          "lights": {
            "type": "boolean",
            "description": "Lights visible?",
            "required": false
          }
        }
      }
    ]
  },
  "AIRCRAFT": {
    "subtypes": [
      {
        "name": "Commercial Airliner",
        "attributes": {
          "airline": {
            "type": "string",
            "required": true
          },
          "flightNumber": {
            "type": "string",
            "required": true
          },
          "aircraftType": {
            "type": "string",
            "description": "e.g., Boeing 737",
            "required": true
          },
          "transponderCode": {
            "type": "string",
            "required": false
          },
          "passengerCapacity": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Private Jet",
        "attributes": {
          "ownerOperator": {
            "type": "string",
            "description": "Company or individual",
            "required": true
          },
          "registration": {
            "type": "string",
            "required": true
          },
          "aircraftType": {
            "type": "string",
            "description": "e.g., Gulfstream G650",
            "required": true
          },
          "transponderCode": {
            "type": "string",
            "required": false
          },
          "passengerCount": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Fighter Jet",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Single-Engine", "Twin-Engine", "Stealth"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "model": {
            "type": "string",
            "description": "e.g., F-16, Su-27",
            "required": true
          },
          "armament": {
            "type": "array",
            "items": "string",
            "description": "Missiles, bombs",
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "required": false
          },
          "squadron": {
            "type": "string",
            "required": false
          }
        }
      },
      {
        "name": "Bomber",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Strategic", "Tactical"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "model": {
            "type": "string",
            "description": "e.g., B-52, Tu-95",
            "required": true
          },
          "payloadCapacity": {
            "type": "string",
            "description": "Bomb load (tons)",
            "required": false
          },
          "range": {
            "type": "integer",
            "description": "Max range (km)",
            "required": false
          }
        }
      },
      {
        "name": "Helicopter",
        "attributes": {
          "variant": {
            "type": "enum",
            "options": ["Transport", "Attack", "Utility", "Medical"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "model": {
            "type": "string",
            "description": "e.g., UH-60 Black Hawk",
            "required": true
          },
          "troopCapacity": {
            "type": "integer",
            "required": false
          },
          "weaponry": {
            "type": "array",
            "items": "string",
            "required": false
          }
        }
      },
      {
        "name": "Cargo/Transport",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Fixed-Wing", "Rotary"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "model": {
            "type": "string",
            "required": true
          },
          "cargoType": {
            "type": "enum",
            "options": ["Troops", "Supplies", "Equipment"],
            "required": false
          },
          "capacity": {
            "type": "string",
            "description": "Weight or volume",
            "required": false
          }
        }
      },
      {
        "name": "Reconnaissance Plane",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["U-2", "Global Hawk", "RC-135", "Other"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "model": {
            "type": "string",
            "required": true
          },
          "sensors": {
            "type": "array",
            "items": "string",
            "description": "Radar, cameras, SIGINT",
            "required": false
          },
          "altitude": {
            "type": "enum",
            "options": ["Low", "Medium", "High"],
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "required": false
          }
        }
      },
      {
        "name": "Trainer Aircraft",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Primary", "Advanced", "Jet"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "model": {
            "type": "string",
            "description": "e.g., T-6 Texan II",
            "required": true
          },
          "dualSeater": {
            "type": "boolean",
            "description": "Has instructor/student seating",
            "required": false
          },
          "markings": {
            "type": "string",
            "description": "Training squadron markings",
            "required": false
          }
        }
      },
      {
        "name": "Glider",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Sailplane", "Hang Glider", "Paraglider"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "wingspan": {
            "type": "string",
            "description": "Approximate wingspan",
            "required": false
          },
          "towPlane": {
            "type": "boolean",
            "description": "Connected to tow plane?",
            "required": false
          },
          "pilotCount": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Tiltrotor",
        "attributes": {
          "variant": {
            "type": "enum",
            "options": ["V-22 Osprey", "Civilian Variant"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "model": {
            "type": "string",
            "required": true
          },
          "troopCapacity": {
            "type": "integer",
            "required": false
          },
          "speed": {
            "type": "string",
            "description": "Estimated speed",
            "required": false
          }
        }
      },
      {
        "name": "AWACS",
        "attributes": {
          "nationality": {
            "type": "string",
            "required": true
          },
          "model": {
            "type": "string",
            "description": "e.g., E-3 Sentry",
            "required": true
          },
          "radarType": {
            "type": "string",
            "description": "Radar system type",
            "required": false
          },
          "crewSize": {
            "type": "integer",
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "required": false
          }
        }
      }
    ]
  },
  "VESSEL": {
    "subtypes": [
      {
        "name": "Commercial Ship",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Cargo", "Container", "Tanker"],
            "required": true
          },
          "name": {
            "type": "string",
            "required": true
          },
          "registry": {
            "type": "string",
            "description": "Flag state",
            "required": true
          },
          "cargo": {
            "type": "string",
            "description": "Type of cargo",
            "required": false
          },
          "crewSize": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Fishing Boat",
        "attributes": {
          "size": {
            "type": "enum",
            "options": ["Small", "Medium", "Large"],
            "required": true
          },
          "registry": {
            "type": "string",
            "required": true
          },
          "gear": {
            "type": "enum",
            "options": ["Trawl", "Longline", "Purse Seine"],
            "required": false
          },
          "lights": {
            "type": "boolean",
            "description": "Fishing lights visible?",
            "required": false
          }
        }
      },
      {
        "name": "Yacht",
        "attributes": {
          "size": {
            "type": "enum",
            "options": ["Small", "Medium", "Large", "Mega Yacht"],
            "required": true
          },
          "name": {
            "type": "string",
            "required": true
          },
          "registry": {
            "type": "string",
            "required": true
          },
          "owner": {
            "type": "string",
            "description": "If known",
            "required": false
          },
          "passengers": {
            "type": "integer",
            "description": "Estimated passenger count",
            "required": false
          }
        }
      },
      {
        "name": "Speedboat",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Rigid Inflatable", "Powerboat", "Jet Boat"],
            "required": true
          },
          "color": {
            "type": "string",
            "required": true
          },
          "registry": {
            "type": "string",
            "required": false
          },
          "engineType": {
            "type": "enum",
            "options": ["Outboard", "Inboard", "Jet"],
            "required": false
          },
          "occupants": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Destroyer",
        "attributes": {
          "class": {
            "type": "string",
            "description": "e.g., Arleigh Burke",
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "armament": {
            "type": "array",
            "items": "string",
            "description": "Missiles, guns",
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "required": false
          },
          "hullNumber": {
            "type": "string",
            "required": false
          }
        }
      },
      {
        "name": "Submarine",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Attack", "Ballistic Missile", "Diesel-Electric"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "class": {
            "type": "string",
            "description": "e.g., Virginia-class",
            "required": true
          },
          "depth": {
            "type": "string",
            "description": "Estimated dive depth",
            "required": false
          },
          "noiseSignature": {
            "type": "enum",
            "options": ["Quiet", "Loud", "Unknown"],
            "required": false
          }
        }
      },
      {
        "name": "Aircraft Carrier",
        "attributes": {
          "class": {
            "type": "string",
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "airWing": {
            "type": "integer",
            "description": "Number of aircraft",
            "required": false
          },
          "escortShips": {
            "type": "integer",
            "description": "Number of escorts",
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "required": false
          }
        }
      },
      {
        "name": "Patrol Boat",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Coastal", "Riverine", "Fast Attack"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "armament": {
            "type": "array",
            "items": "string",
            "description": "Light arms, missiles",
            "required": false
          },
          "crewSize": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Frigate",
        "attributes": {
          "class": {
            "type": "string",
            "description": "e.g., Oliver Hazard Perry",
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "armament": {
            "type": "array",
            "items": "string",
            "description": "Missiles, torpedoes",
            "required": false
          },
          "helicopterHangar": {
            "type": "boolean",
            "description": "Has helicopter facilities?",
            "required": false
          },
          "iffStatus": {
            "type": "enum",
            "options": ["Friend", "Foe", "Unknown"],
            "required": false
          }
        }
      },
      {
        "name": "Corvette",
        "attributes": {
          "class": {
            "type": "string",
            "description": "e.g., Visby-class",
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "armament": {
            "type": "array",
            "items": "string",
            "description": "Guns, missiles",
            "required": false
          },
          "speed": {
            "type": "string",
            "description": "Estimated speed",
            "required": false
          },
          "crewSize": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Amphibious Assault Ship",
        "attributes": {
          "class": {
            "type": "string",
            "description": "e.g., Wasp-class",
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "troopCapacity": {
            "type": "integer",
            "required": false
          },
          "vehicleCapacity": {
            "type": "integer",
            "required": false
          },
          "aircraft": {
            "type": "array",
            "items": "string",
            "description": "Helicopters, VTOL aircraft",
            "required": false
          }
        }
      },
      {
        "name": "Mine Countermeasures Vessel",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Minesweeper", "Minehunter"],
            "required": true
          },
          "nationality": {
            "type": "string",
            "required": true
          },
          "sensors": {
            "type": "array",
            "items": "string",
            "description": "Sonar, detection equipment",
            "required": false
          },
          "equipment": {
            "type": "array",
            "items": "string",
            "description": "Mine disposal systems",
            "required": false
          },
          "crewSize": {
            "type": "integer",
            "required": false
          }
        }
      }
    ]
  },
  "DRONE": {
    "subtypes": [
      {
        "name": "Surveillance Drone",
        "attributes": {
          "size": {
            "type": "enum",
            "options": ["Small", "Medium", "Large"],
            "required": true
          },
          "operator": {
            "type": "enum",
            "options": ["Military", "Civilian", "Unknown"],
            "required": true
          },
          "payload": {
            "type": "enum",
            "options": ["Camera", "Sensors", "SIGINT"],
            "required": false
          },
          "altitudeRange": {
            "type": "string",
            "description": "Typical operating altitude",
            "required": false
          },
          "controlLink": {
            "type": "enum",
            "options": ["LOS", "BLOS", "Unknown"],
            "description": "Line of Sight or Beyond",
            "required": false
          }
        }
      },
      {
        "name": "Combat Drone",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["UAV Strike", "Loitering Munition"],
            "required": true
          },
          "operator": {
            "type": "enum",
            "options": ["Military", "Insurgent", "Unknown"],
            "required": true
          },
          "armament": {
            "type": "array",
            "items": "string",
            "description": "Missiles, bombs",
            "required": true
          },
          "range": {
            "type": "integer",
            "description": "Operational range (km)",
            "required": false
          },
          "speed": {
            "type": "string",
            "description": "Max speed (knots)",
            "required": false
          }
        }
      },
      {
        "name": "Commercial Drone",
        "attributes": {
          "purpose": {
            "type": "enum",
            "options": ["Delivery", "Aerial Photography", "Agricultural"],
            "required": true
          },
          "manufacturer": {
            "type": "string",
            "required": true
          },
          "registration": {
            "type": "string",
            "required": false
          },
          "payload": {
            "type": "string",
            "description": "Package or camera type",
            "required": false
          }
        }
      },
      {
        "name": "Loitering Munition",
        "attributes": {
          "operator": {
            "type": "enum",
            "options": ["Military", "Insurgent", "Unknown"],
            "required": true
          },
          "payload": {
            "type": "string",
            "description": "Explosive type and size",
            "required": true
          },
          "endurance": {
            "type": "integer",
            "description": "Flight time (minutes)",
            "required": false
          },
          "range": {
            "type": "integer",
            "description": "Operational range (km)",
            "required": false
          },
          "speed": {
            "type": "string",
            "description": "Max speed",
            "required": false
          }
        }
      },
      {
        "name": "Swarm Drone",
        "attributes": {
          "count": {
            "type": "integer",
            "description": "Number of drones in swarm",
            "required": true
          },
          "operator": {
            "type": "enum",
            "options": ["Military", "Civilian", "Unknown"],
            "required": true
          },
          "coordination": {
            "type": "enum",
            "options": ["Tight Formation", "Loose Formation", "Independent"],
            "required": false
          },
          "payload": {
            "type": "string",
            "description": "Collective payload",
            "required": false
          },
          "formation": {
            "type": "string",
            "description": "Flight pattern",
            "required": false
          }
        }
      },
      {
        "name": "Delivery Drone",
        "attributes": {
          "manufacturer": {
            "type": "string",
            "required": true
          },
          "payloadWeight": {
            "type": "string",
            "description": "Weight capacity",
            "required": false
          },
          "range": {
            "type": "integer",
            "description": "Delivery range (km)",
            "required": false
          },
          "registration": {
            "type": "string",
            "required": false
          },
          "route": {
            "type": "string",
            "description": "Apparent delivery path",
            "required": false
          }
        }
      },
      {
        "name": "Agricultural Drone",
        "attributes": {
          "manufacturer": {
            "type": "string",
            "required": true
          },
          "sensors": {
            "type": "array",
            "items": "string",
            "description": "Multispectral, NDVI cameras",
            "required": false
          },
          "coverageArea": {
            "type": "string",
            "description": "Field size coverage",
            "required": false
          },
          "chemicalLoad": {
            "type": "boolean",
            "description": "Carrying pesticides/fertilizers?",
            "required": false
          },
          "operator": {
            "type": "enum",
            "options": ["Farmer", "Service Company", "Unknown"],
            "required": false
          }
        }
      },
      {
        "name": "Search and Rescue Drone",
        "attributes": {
          "operator": {
            "type": "enum",
            "options": ["Coast Guard", "Fire Department", "Mountain Rescue", "Military"],
            "required": true
          },
          "sensors": {
            "type": "array",
            "items": "string",
            "description": "Thermal, FLIR, zoom cameras",
            "required": false
          },
          "endurance": {
            "type": "integer",
            "description": "Flight time (minutes)",
            "required": false
          },
          "payload": {
            "type": "string",
            "description": "Life raft, medical supplies",
            "required": false
          },
          "lights": {
            "type": "boolean",
            "description": "Search lights visible?",
            "required": false
          }
        }
      }
    ]
  },
  "ANIMAL": {
    "subtypes": [
      {
        "name": "Large Mammal",
        "attributes": {
          "species": {
            "type": "enum",
            "options": ["Elephant", "Lion", "Bear", "Deer"],
            "required": true
          },
          "behavior": {
            "type": "enum",
            "options": ["Migrating", "Foraging", "Aggressive"],
            "required": false
          },
          "groupSize": {
            "type": "integer",
            "required": false
          },
          "collar": {
            "type": "boolean",
            "description": "Tagged or collared?",
            "required": false
          }
        }
      },
      {
        "name": "Bird",
        "attributes": {
          "species": {
            "type": "enum",
            "options": ["Eagle", "Falcon", "Crow", "Migratory Flock"],
            "required": true
          },
          "flockSize": {
            "type": "integer",
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Nesting", "Flying Low", "Scavenging"],
            "required": false
          },
          "wingspan": {
            "type": "string",
            "description": "Approximate size",
            "required": false
          }
        }
      },
      {
        "name": "Working Animal",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Dog (Guard)", "Horse (Mounted)", "Mule (Pack)"],
            "required": true
          },
          "handler": {
            "type": "boolean",
            "description": "With human handler?",
            "required": false
          },
          "gear": {
            "type": "string",
            "description": "Saddle, harness",
            "required": false
          },
          "breed": {
            "type": "string",
            "required": false
          }
        }
      },
      {
        "name": "Small Mammal",
        "attributes": {
          "species": {
            "type": "enum",
            "options": ["Rabbit", "Fox", "Raccoon", "Squirrel"],
            "required": true
          },
          "behavior": {
            "type": "enum",
            "options": ["Foraging", "Burrowing", "Fleeing"],
            "required": false
          },
          "burrowSigns": {
            "type": "boolean",
            "description": "Evidence of burrowing?",
            "required": false
          },
          "groupSize": {
            "type": "integer",
            "required": false
          }
        }
      },
      {
        "name": "Reptile",
        "attributes": {
          "species": {
            "type": "enum",
            "options": ["Snake", "Lizard", "Crocodile", "Turtle"],
            "required": true
          },
          "size": {
            "type": "enum",
            "options": ["Small", "Medium", "Large"],
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Basking", "Moving", "Aggressive"],
            "required": false
          },
          "tracks": {
            "type": "boolean",
            "description": "Visible tracks?",
            "required": false
          },
          "venomous": {
            "type": "boolean",
            "description": "Appears venomous?",
            "required": false
          }
        }
      },
      {
        "name": "Aquatic Animal",
        "attributes": {
          "species": {
            "type": "enum",
            "options": ["Dolphin", "Whale", "Seal", "Shark"],
            "required": true
          },
          "behavior": {
            "type": "enum",
            "options": ["Swimming", "Breaching", "Feeding"],
            "required": false
          },
          "podSize": {
            "type": "integer",
            "description": "Number in group",
            "required": false
          },
          "migrationPath": {
            "type": "string",
            "description": "Known migration route",
            "required": false
          }
        }
      },
      {
        "name": "Insect Swarm",
        "attributes": {
          "type": {
            "type": "enum",
            "options": ["Bees", "Locusts", "Mosquitoes", "Butterflies"],
            "required": true
          },
          "density": {
            "type": "enum",
            "options": ["Sparse", "Moderate", "Dense"],
            "required": false
          },
          "behavior": {
            "type": "enum",
            "options": ["Swarming", "Migrating", "Nesting"],
            "required": false
          },
          "seasonal": {
            "type": "boolean",
            "description": "Seasonal occurrence?",
            "required": false
          }
        }
      }
    ]
  },
  "UNKNOWN": {
    "subtypes": [
      {
        "name": "Generic",
        "attributes": {
          "description": {
            "type": "string",
            "description": "Free-text description",
            "required": true
          },
          "sizeEstimate": {
            "type": "enum",
            "options": ["Small", "Medium", "Large"],
            "required": false
          },
          "shape": {
            "type": "string",
            "required": false
          }
        }
      },
      {
        "name": "Shadow",
        "attributes": {
          "description": {
            "type": "string",
            "description": "Description of shadow appearance",
            "required": true
          },
          "movementPattern": {
            "type": "enum",
            "options": ["Erratic", "Linear", "Stationary", "Circular"],
            "required": false
          },
          "sizeEstimate": {
            "type": "enum",
            "options": ["Small", "Medium", "Large"],
            "required": false
          }
        }
      },
      {
        "name": "Anomaly",
        "attributes": {
          "description": {
            "type": "string",
            "description": "Description of anomalous behavior/appearance",
            "required": true
          },
          "anomalyType": {
            "type": "enum",
            "options": ["Thermal", "Radiation", "Acoustic", "Visual"],
            "required": false
          },
          "duration": {
            "type": "string",
            "description": "How long observed",
            "required": false
          }
        }
      },
      {
        "name": "Thermal Signature",
        "attributes": {
          "description": {
            "type": "string",
            "description": "Description of thermal pattern",
            "required": true
          },
          "heatLevel": {
            "type": "enum",
            "options": ["Cold", "Cool", "Neutral", "Warm", "Hot"],
            "required": false
          },
          "shape": {
            "type": "string",
            "required": false
          }
        }
      }
    ]
  }
}

