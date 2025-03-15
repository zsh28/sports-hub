/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sports_hub.json`.
 */
export type SportsHub = {
  "address": "DxbcyaGtfDoVJwYEu6XTRScs66EJwZ9QgaBrviycGSfV",
  "metadata": {
    "name": "sportsHub",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createEvent",
      "discriminator": [
        49,
        219,
        29,
        203,
        22,
        98,
        100,
        87
      ],
      "accounts": [
        {
          "name": "event",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true,
          "address": "5EvTWpYhC3PFkiyuMzcTebKgT13S9BJwTtkXGiuiVrPf"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "fplEventId",
          "type": "u64"
        },
        {
          "name": "teamA",
          "type": "string"
        },
        {
          "name": "teamB",
          "type": "string"
        },
        {
          "name": "kickoffTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "deleteEvent",
      "discriminator": [
        103,
        111,
        95,
        106,
        232,
        24,
        190,
        84
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "address": "5EvTWpYhC3PFkiyuMzcTebKgT13S9BJwTtkXGiuiVrPf"
        },
        {
          "name": "event",
          "writable": true
        },
        {
          "name": "bet",
          "writable": true,
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "event"
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "distributeRewards",
      "discriminator": [
        97,
        6,
        227,
        255,
        124,
        165,
        3,
        148
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "house"
              }
            ]
          }
        },
        {
          "name": "event",
          "writable": true
        },
        {
          "name": "bet",
          "writable": true
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "playerStats",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "house"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "house",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "house"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "placeBet",
      "discriminator": [
        222,
        62,
        67,
        220,
        63,
        166,
        126,
        33
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "event",
          "writable": true
        },
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "event"
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "playerStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u64"
        },
        {
          "name": "outcome",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resolveEvent",
      "discriminator": [
        184,
        55,
        78,
        47,
        114,
        38,
        50,
        90
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "address": "5EvTWpYhC3PFkiyuMzcTebKgT13S9BJwTtkXGiuiVrPf"
        },
        {
          "name": "event",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "u64"
        },
        {
          "name": "winningOutcome",
          "type": {
            "option": "u8"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bet",
      "discriminator": [
        147,
        23,
        35,
        59,
        15,
        75,
        155,
        32
      ]
    },
    {
      "name": "event",
      "discriminator": [
        125,
        192,
        125,
        158,
        9,
        115,
        152,
        233
      ]
    },
    {
      "name": "playerStats",
      "discriminator": [
        169,
        146,
        242,
        176,
        102,
        118,
        231,
        172
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "eventAlreadyResolved",
      "msg": "Event has already been resolved"
    },
    {
      "code": 6001,
      "name": "invalidOutcome",
      "msg": "Invalid outcome provided"
    },
    {
      "code": 6002,
      "name": "eventNotResolved",
      "msg": "Event not resolved yet"
    },
    {
      "code": 6003,
      "name": "bettingClosed",
      "msg": "Betting closed"
    },
    {
      "code": 6004,
      "name": "alreadyClaimed",
      "msg": "Already claimed"
    },
    {
      "code": 6005,
      "name": "eventNotStarted",
      "msg": "Event not started"
    },
    {
      "code": 6006,
      "name": "invalidBetAmount",
      "msg": "Invalid bet amount"
    },
    {
      "code": 6007,
      "name": "invalidEvent",
      "msg": "Invalid event ID"
    },
    {
      "code": 6008,
      "name": "insufficientVaultFunds",
      "msg": "Insufficient vault funds"
    },
    {
      "code": 6009,
      "name": "rewardCalculationFailed",
      "msg": "Reward calculation failed"
    },
    {
      "code": 6010,
      "name": "betLost",
      "msg": "Bet lost"
    },
    {
      "code": 6011,
      "name": "betOverflow",
      "msg": "Bet overflow"
    },
    {
      "code": 6012,
      "name": "rewardAlreadyClaimed",
      "msg": "Reward already claimed"
    },
    {
      "code": 6013,
      "name": "rewardsNotClaimed",
      "msg": "Rewards not claimed"
    },
    {
      "code": 6014,
      "name": "invalidPlayer",
      "msg": "Invalid player"
    }
  ],
  "types": [
    {
      "name": "bet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "eventId",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "claimable",
            "type": "bool"
          },
          {
            "name": "isWon",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "outcome",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "eventId",
            "type": "u64"
          },
          {
            "name": "teamA",
            "type": "string"
          },
          {
            "name": "teamB",
            "type": "string"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "totalBets",
            "type": "u64"
          },
          {
            "name": "outcomeABets",
            "type": "u64"
          },
          {
            "name": "outcomeBBets",
            "type": "u64"
          },
          {
            "name": "drawBets",
            "type": "u64"
          },
          {
            "name": "resolved",
            "type": "bool"
          },
          {
            "name": "winningOutcome",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "playerStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalBets",
            "type": "u64"
          },
          {
            "name": "totalWinnings",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "seed",
      "type": "string",
      "value": "\"anchor\""
    }
  ]
};
