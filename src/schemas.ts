/**
 * This file was auto-generated from openapi.yaml by scripts/generate-schemas.mjs.
 * Do not make direct changes to the file.
 */
export const schemaDefs: Record<string, object> = {
  "StatusHeartbeatResponse": {
    "type": "object",
    "required": [
      "heartbeatList",
      "uptimeList"
    ],
    "properties": {
      "heartbeatList": {
        "type": "object",
        "description": "Heartbeat history keyed by monitor ID, ordered oldest to newest.",
        "additionalProperties": {
          "type": "array",
          "maxItems": 100,
          "items": {
            "$ref": "#/$defs/StatusHeartbeat"
          }
        }
      },
      "uptimeList": {
        "type": "object",
        "description": "Rolling 24-hour uptime ratios keyed as `{monitorId}_24`.",
        "additionalProperties": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "examples": [
            1
          ]
        }
      }
    }
  },
  "StatusHeartbeat": {
    "type": "object",
    "required": [
      "status",
      "time",
      "msg",
      "ping"
    ],
    "properties": {
      "status": {
        "type": "integer",
        "description": "Heartbeat status. `0` down, `1` up, `2` pending, or `3` maintenance.",
        "enum": [
          0,
          1,
          2,
          3
        ]
      },
      "time": {
        "type": "string",
        "description": "Heartbeat time in `YYYY-MM-DD HH:mm:ss` format.",
        "examples": [
          "2026-07-21 13:11:27"
        ]
      },
      "msg": {
        "type": "string",
        "description": "Public message; currently redacted to an empty string.",
        "examples": [
          ""
        ]
      },
      "ping": {
        "description": "Response time in milliseconds, or `null` when unavailable.",
        "type": [
          "number",
          "null"
        ],
        "examples": [
          85
        ]
      }
    }
  },
  "SuccessEnvelope": {
    "type": "object",
    "required": [
      "status"
    ],
    "properties": {
      "status": {
        "type": "string",
        "enum": [
          "success"
        ]
      }
    }
  },
  "ErrorResponse": {
    "type": "object",
    "required": [
      "status",
      "data"
    ],
    "properties": {
      "status": {
        "type": "string",
        "enum": [
          "error"
        ]
      },
      "data": {
        "oneOf": [
          {
            "type": "string"
          },
          {
            "type": "object",
            "additionalProperties": true
          },
          {
            "type": "null"
          }
        ]
      }
    }
  },
  "UserResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/UserDetails"
          }
        }
      }
    ]
  },
  "MatchListResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/MatchInfo"
            }
          }
        }
      }
    ]
  },
  "VersusResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/VersusStats"
          }
        }
      }
    ]
  },
  "UserSeasonsResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/UserSeasonSummary"
          }
        }
      }
    ]
  },
  "UserLiveResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/UserLiveData"
          }
        }
      }
    ]
  },
  "MatchDetailResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/MatchInfo"
          }
        }
      }
    ]
  },
  "PublicLiveResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/PublicLiveData"
          }
        }
      }
    ]
  },
  "LeaderboardResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/Leaderboard"
          }
        }
      }
    ]
  },
  "PhaseLeaderboardResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/PhaseLeaderboard"
          }
        }
      }
    ]
  },
  "RecordLeaderboardResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/RecordLeaderboardEntry"
            }
          }
        }
      }
    ]
  },
  "WeeklyRaceResponse": {
    "allOf": [
      {
        "$ref": "#/$defs/SuccessEnvelope"
      },
      {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "$ref": "#/$defs/WeeklyRace"
          }
        }
      }
    ]
  },
  "UserIdentifier": {
    "type": "string",
    "description": "UUID, nickname, or `discord.{id}`."
  },
  "Date": {
    "type": "integer",
    "description": "Epoch timestamp in seconds."
  },
  "Time": {
    "type": "integer",
    "description": "Duration in milliseconds."
  },
  "MatchType": {
    "type": "integer",
    "description": "Match type identifier.",
    "enum": [
      1,
      2,
      3,
      4
    ]
  },
  "UserProfile": {
    "type": "object",
    "required": [
      "uuid",
      "nickname",
      "roleType",
      "eloRate",
      "eloRank",
      "country"
    ],
    "properties": {
      "uuid": {
        "type": "string",
        "description": "User UUID without dashes."
      },
      "nickname": {
        "type": "string"
      },
      "roleType": {
        "type": "integer"
      },
      "eloRate": {
        "type": [
          "integer",
          "null"
        ]
      },
      "eloRank": {
        "type": [
          "integer",
          "null"
        ]
      },
      "country": {
        "type": [
          "string",
          "null"
        ],
        "pattern": "^[a-z]{2}$"
      }
    }
  },
  "Achievement": {
    "type": "object",
    "required": [
      "id",
      "date",
      "data",
      "level",
      "value",
      "goal"
    ],
    "properties": {
      "id": {
        "type": "string"
      },
      "date": {
        "$ref": "#/$defs/Date"
      },
      "data": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "level": {
        "type": "integer"
      },
      "value": {
        "type": [
          "integer",
          "null"
        ]
      },
      "goal": {
        "type": [
          "integer",
          "null"
        ]
      }
    }
  },
  "MatchSeed": {
    "type": "object",
    "required": [
      "id",
      "overworld",
      "nether",
      "endTowers",
      "variations"
    ],
    "properties": {
      "id": {
        "type": [
          "string",
          "null"
        ]
      },
      "overworld": {
        "type": [
          "string",
          "null"
        ]
      },
      "nether": {
        "type": [
          "string",
          "null"
        ]
      },
      "endTowers": {
        "type": "array",
        "items": {
          "type": "integer"
        }
      },
      "variations": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    }
  },
  "WeeklyRaceSeed": {
    "type": "object",
    "required": [
      "overworld",
      "nether",
      "theEnd",
      "rng",
      "flags"
    ],
    "properties": {
      "overworld": {
        "type": "string"
      },
      "nether": {
        "type": "string"
      },
      "theEnd": {
        "type": "string"
      },
      "rng": {
        "type": "string"
      },
      "flags": {
        "type": "integer"
      }
    }
  },
  "RankedCasualStat": {
    "type": "object",
    "required": [
      "ranked",
      "casual"
    ],
    "properties": {
      "ranked": {
        "type": [
          "integer",
          "null"
        ]
      },
      "casual": {
        "type": [
          "integer",
          "null"
        ]
      }
    }
  },
  "StatisticCategoryMap": {
    "type": "object",
    "additionalProperties": {
      "$ref": "#/$defs/RankedCasualStat"
    }
  },
  "UserConnection": {
    "type": "object",
    "required": [
      "id",
      "name"
    ],
    "properties": {
      "id": {
        "type": "string"
      },
      "name": {
        "type": "string"
      }
    }
  },
  "SeasonStanding": {
    "type": "object",
    "required": [
      "eloRate",
      "eloRank",
      "phasePoint"
    ],
    "properties": {
      "eloRate": {
        "type": [
          "integer",
          "null"
        ]
      },
      "eloRank": {
        "type": [
          "integer",
          "null"
        ]
      },
      "phasePoint": {
        "type": "integer"
      }
    }
  },
  "SeasonPhaseResult": {
    "type": "object",
    "required": [
      "phase",
      "eloRate",
      "eloRank",
      "point"
    ],
    "properties": {
      "phase": {
        "type": "integer"
      },
      "eloRate": {
        "type": "integer"
      },
      "eloRank": {
        "type": "integer"
      },
      "point": {
        "type": "integer"
      }
    }
  },
  "SeasonResultDetailed": {
    "type": "object",
    "required": [
      "last",
      "highest",
      "lowest",
      "phases"
    ],
    "properties": {
      "last": {
        "$ref": "#/$defs/SeasonStanding"
      },
      "highest": {
        "type": [
          "integer",
          "null"
        ]
      },
      "lowest": {
        "type": [
          "integer",
          "null"
        ]
      },
      "phases": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/SeasonPhaseResult"
        }
      }
    }
  },
  "WeeklyRaceResult": {
    "type": "object",
    "required": [
      "id",
      "time",
      "rank"
    ],
    "properties": {
      "id": {
        "type": "integer"
      },
      "time": {
        "$ref": "#/$defs/Time"
      },
      "rank": {
        "type": "integer"
      }
    }
  },
  "UserDetails": {
    "allOf": [
      {
        "$ref": "#/$defs/UserProfile"
      },
      {
        "type": "object",
        "required": [
          "achievements",
          "timestamp",
          "statistics",
          "connections",
          "seasonResult",
          "weeklyRaces"
        ],
        "properties": {
          "achievements": {
            "type": "object",
            "required": [
              "display",
              "total"
            ],
            "properties": {
              "display": {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/Achievement"
                }
              },
              "total": {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/Achievement"
                }
              }
            }
          },
          "timestamp": {
            "type": "object",
            "required": [
              "firstOnline",
              "lastOnline",
              "lastRanked",
              "nextDecay"
            ],
            "properties": {
              "firstOnline": {
                "$ref": "#/$defs/Date"
              },
              "lastOnline": {
                "$ref": "#/$defs/Date"
              },
              "lastRanked": {
                "$ref": "#/$defs/Date"
              },
              "nextDecay": {
                "type": [
                  "integer",
                  "null"
                ]
              }
            }
          },
          "statistics": {
            "type": "object",
            "required": [
              "season",
              "total"
            ],
            "properties": {
              "season": {
                "$ref": "#/$defs/StatisticCategoryMap"
              },
              "total": {
                "$ref": "#/$defs/StatisticCategoryMap"
              }
            }
          },
          "connections": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/$defs/UserConnection"
            }
          },
          "seasonResult": {
            "oneOf": [
              {
                "$ref": "#/$defs/SeasonResultDetailed"
              },
              {
                "type": "null"
              }
            ]
          },
          "weeklyRaces": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/WeeklyRaceResult"
            }
          }
        }
      }
    ]
  },
  "UserSeasonSummary": {
    "allOf": [
      {
        "$ref": "#/$defs/UserProfile"
      },
      {
        "type": "object",
        "required": [
          "seasonResults"
        ],
        "properties": {
          "seasonResults": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/$defs/SeasonResultDetailed"
            }
          }
        }
      }
    ]
  },
  "MatchResult": {
    "type": "object",
    "required": [
      "uuid",
      "time"
    ],
    "properties": {
      "uuid": {
        "type": [
          "string",
          "null"
        ]
      },
      "time": {
        "$ref": "#/$defs/Time"
      }
    }
  },
  "MatchRank": {
    "type": "object",
    "required": [
      "season",
      "allTime"
    ],
    "properties": {
      "season": {
        "type": [
          "integer",
          "null"
        ]
      },
      "allTime": {
        "type": [
          "integer",
          "null"
        ]
      }
    }
  },
  "MatchChange": {
    "type": "object",
    "required": [
      "uuid",
      "change",
      "eloRate"
    ],
    "properties": {
      "uuid": {
        "type": "string"
      },
      "change": {
        "type": [
          "integer",
          "null"
        ]
      },
      "eloRate": {
        "type": [
          "integer",
          "null"
        ]
      }
    }
  },
  "MatchVod": {
    "type": "object",
    "required": [
      "uuid",
      "url",
      "startsAt"
    ],
    "properties": {
      "uuid": {
        "type": "string"
      },
      "url": {
        "type": "string"
      },
      "startsAt": {
        "$ref": "#/$defs/Date"
      }
    }
  },
  "CompletionEntry": {
    "type": "object",
    "required": [
      "uuid",
      "time"
    ],
    "properties": {
      "uuid": {
        "type": "string"
      },
      "time": {
        "$ref": "#/$defs/Time"
      }
    }
  },
  "TimelineEntry": {
    "type": "object",
    "required": [
      "uuid",
      "time",
      "type"
    ],
    "properties": {
      "uuid": {
        "type": "string"
      },
      "time": {
        "$ref": "#/$defs/Time"
      },
      "type": {
        "type": "string"
      }
    }
  },
  "MatchInfo": {
    "type": "object",
    "required": [
      "id",
      "type",
      "season",
      "date",
      "players",
      "spectators",
      "result",
      "forfeited",
      "decayed",
      "rank",
      "changes",
      "beginner",
      "botSource"
    ],
    "properties": {
      "id": {
        "type": "integer"
      },
      "type": {
        "$ref": "#/$defs/MatchType"
      },
      "season": {
        "type": "integer"
      },
      "category": {
        "type": [
          "string",
          "null"
        ]
      },
      "gameMode": {
        "type": [
          "string",
          "null"
        ]
      },
      "date": {
        "$ref": "#/$defs/Date"
      },
      "players": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/UserProfile"
        }
      },
      "spectators": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/UserProfile"
        }
      },
      "seed": {
        "oneOf": [
          {
            "$ref": "#/$defs/MatchSeed"
          },
          {
            "type": "null"
          }
        ]
      },
      "result": {
        "$ref": "#/$defs/MatchResult"
      },
      "forfeited": {
        "type": "boolean"
      },
      "decayed": {
        "type": "boolean"
      },
      "rank": {
        "$ref": "#/$defs/MatchRank"
      },
      "changes": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/MatchChange"
        }
      },
      "vod": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/MatchVod"
        }
      },
      "completions": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/CompletionEntry"
        }
      },
      "timelines": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/TimelineEntry"
        }
      },
      "tag": {
        "type": [
          "string",
          "null"
        ]
      },
      "replayExist": {
        "type": "boolean"
      },
      "beginner": {
        "type": "boolean"
      },
      "botSource": {
        "type": [
          "string",
          "null"
        ]
      },
      "seedType": {
        "type": [
          "string",
          "null"
        ]
      },
      "bastionType": {
        "type": [
          "string",
          "null"
        ]
      }
    }
  },
  "VersusResultMap": {
    "type": "object",
    "additionalProperties": {
      "type": "integer"
    }
  },
  "VersusStats": {
    "type": "object",
    "required": [
      "players",
      "results",
      "changes"
    ],
    "properties": {
      "players": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/UserProfile"
        }
      },
      "results": {
        "type": "object",
        "required": [
          "ranked",
          "casual"
        ],
        "properties": {
          "ranked": {
            "$ref": "#/$defs/VersusResultMap"
          },
          "casual": {
            "$ref": "#/$defs/VersusResultMap"
          }
        }
      },
      "changes": {
        "type": "object",
        "additionalProperties": {
          "type": "integer"
        }
      }
    }
  },
  "UserLiveData": {
    "type": "object",
    "required": [
      "lastId",
      "type",
      "status",
      "time",
      "players",
      "spectators",
      "timelines",
      "completions"
    ],
    "properties": {
      "lastId": {
        "type": [
          "integer",
          "null"
        ]
      },
      "type": {
        "$ref": "#/$defs/MatchType"
      },
      "status": {
        "type": "string",
        "enum": [
          "idle",
          "counting",
          "generate",
          "ready",
          "running",
          "done"
        ]
      },
      "time": {
        "$ref": "#/$defs/Time"
      },
      "players": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/UserProfile"
        }
      },
      "spectators": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/UserProfile"
        }
      },
      "timelines": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/TimelineEntry"
        }
      },
      "completions": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/CompletionEntry"
        }
      }
    }
  },
  "LiveTimelineSnapshot": {
    "type": "object",
    "required": [
      "time",
      "type"
    ],
    "properties": {
      "time": {
        "$ref": "#/$defs/Time"
      },
      "type": {
        "type": "string"
      }
    }
  },
  "LiveMatchPlayerData": {
    "type": "object",
    "required": [
      "liveUrl",
      "timeline"
    ],
    "properties": {
      "liveUrl": {
        "type": [
          "string",
          "null"
        ]
      },
      "timeline": {
        "oneOf": [
          {
            "$ref": "#/$defs/LiveTimelineSnapshot"
          },
          {
            "type": "null"
          }
        ]
      }
    }
  },
  "LiveMatch": {
    "type": "object",
    "required": [
      "currentTime",
      "players",
      "data"
    ],
    "properties": {
      "currentTime": {
        "$ref": "#/$defs/Time"
      },
      "players": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/UserProfile"
        }
      },
      "data": {
        "type": "object",
        "additionalProperties": {
          "$ref": "#/$defs/LiveMatchPlayerData"
        }
      }
    }
  },
  "PublicLiveData": {
    "type": "object",
    "required": [
      "players",
      "liveMatches"
    ],
    "properties": {
      "players": {
        "type": "integer"
      },
      "liveMatches": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/LiveMatch"
        }
      }
    }
  },
  "LeaderboardSeason": {
    "type": "object",
    "required": [
      "startsAt",
      "endsAt",
      "number"
    ],
    "properties": {
      "startsAt": {
        "$ref": "#/$defs/Date"
      },
      "endsAt": {
        "$ref": "#/$defs/Date"
      },
      "number": {
        "type": "integer"
      }
    }
  },
  "UserProfileWithSeasonResult": {
    "allOf": [
      {
        "$ref": "#/$defs/UserProfile"
      },
      {
        "type": "object",
        "required": [
          "seasonResult"
        ],
        "properties": {
          "seasonResult": {
            "$ref": "#/$defs/SeasonStanding"
          }
        }
      }
    ]
  },
  "Leaderboard": {
    "type": "object",
    "required": [
      "season",
      "users"
    ],
    "properties": {
      "season": {
        "$ref": "#/$defs/LeaderboardSeason"
      },
      "users": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/UserProfileWithSeasonResult"
        }
      }
    }
  },
  "PhaseInfo": {
    "type": "object",
    "required": [
      "endsAt",
      "number",
      "season"
    ],
    "properties": {
      "endsAt": {
        "type": [
          "integer",
          "null"
        ]
      },
      "number": {
        "type": [
          "integer",
          "null"
        ]
      },
      "season": {
        "type": "integer"
      }
    }
  },
  "UserProfileWithPredictedPoints": {
    "allOf": [
      {
        "$ref": "#/$defs/UserProfileWithSeasonResult"
      },
      {
        "type": "object",
        "required": [
          "predPhasePoint"
        ],
        "properties": {
          "predPhasePoint": {
            "type": "integer"
          }
        }
      }
    ]
  },
  "PhaseLeaderboard": {
    "type": "object",
    "required": [
      "phase",
      "users"
    ],
    "properties": {
      "phase": {
        "$ref": "#/$defs/PhaseInfo"
      },
      "users": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/UserProfileWithPredictedPoints"
        }
      }
    }
  },
  "RecordLeaderboardEntry": {
    "type": "object",
    "required": [
      "rank",
      "id",
      "season",
      "date",
      "time",
      "user",
      "seed"
    ],
    "properties": {
      "rank": {
        "type": "integer"
      },
      "id": {
        "type": "integer"
      },
      "season": {
        "type": "integer"
      },
      "date": {
        "$ref": "#/$defs/Date"
      },
      "time": {
        "$ref": "#/$defs/Time"
      },
      "user": {
        "$ref": "#/$defs/UserProfile"
      },
      "seed": {
        "$ref": "#/$defs/MatchSeed"
      }
    }
  },
  "WeeklyRaceEntry": {
    "type": "object",
    "required": [
      "rank",
      "player",
      "time",
      "replayExist"
    ],
    "properties": {
      "rank": {
        "type": "integer"
      },
      "player": {
        "$ref": "#/$defs/UserProfile"
      },
      "time": {
        "$ref": "#/$defs/Time"
      },
      "replayExist": {
        "type": "boolean"
      }
    }
  },
  "WeeklyRace": {
    "type": "object",
    "required": [
      "id",
      "seed",
      "endsAt",
      "leaderboard"
    ],
    "properties": {
      "id": {
        "type": "integer"
      },
      "seed": {
        "$ref": "#/$defs/WeeklyRaceSeed"
      },
      "endsAt": {
        "$ref": "#/$defs/Date"
      },
      "leaderboard": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/WeeklyRaceEntry"
        }
      }
    }
  }
};
