export enum TILE_TYPE_ENUM {
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  WALL_COLUMN = 'WALL_COLUMN',
  WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
  CLIFF_LEFT = 'CLIFF_LEFT',
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  FLOOR = 'FLOOR',
  CLIFF_CENTER = 'CLIFF_CENTER',
  WALL_ROW = 'WALL_ROW',
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  CLIFF_RIGHT = 'CLIFF_RIGHT',
}

export enum EVENT_ENUM {
  NEXT_LEVEL = 'NEXT_LEVEL',
  PLAYER_CTRL = 'PLAYER_CTRL',
  PLAYER_MOVE_END = 'PLAYER_MOVE_END',
  PLAYER_BORN = 'PLAYER_BORN',
}

export enum CONTROLLER_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TURNLEFT = 'TURNLEFT',
  TURNRIGHT = 'TURNRIGHT',
}

export enum FSM_PARAMS_TYPE_ENUM {
  NUMBER = 'NUMBER',
  TRIGGER = 'TRIGGER',
}

export enum PARAMS_NAME_ENUM {
  IDLE = 'IDLE',
  TURNLEFT = 'TURNLEFT',
  BLOCKFRONT = 'BLOCKFRONT',
  BLOCKTURNLEFT = 'BLOCKTURNLEFT',
  DIRECTION = 'DIRECTION',
  ATTACK = 'ATTACK',
}

export enum DIRECTION_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum ENTITY_STATE_ENUM {
  IDLE = 'IDLE',
  TURNLEFT = 'TURNLEFT',
  BLOCKFRONT = 'BLOCKFRONT',
  BLOCKTURNLEFT = 'BLOCKTURNLEFT',
  ATTACK = 'ATTACK',
}

export enum DIRECTION_ORDER_ENUM {
  TOP = 0,
  BOTTOM = 1,
  LEFT = 2,
  RIGHT = 3,
}

export enum ENTITY_TYPE_ENUM {
  PLAYER = 'PLAYER',
}