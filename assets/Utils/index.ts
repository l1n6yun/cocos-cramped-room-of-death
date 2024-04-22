import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Script/Tile/TileManager'

export const createUINode = () => {
  const node = new Node()
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0, 1)
  node.layer = 1 << Layers.nameToLayer('UI_2D')
  return node
}

export const randomBtRange = (start: number, end: number) => Math.floor(start + (end - start) * Math.random())

const reg = /\((\d+)\)/

const getNumberWithinString = (str: string) => parseInt(str.match(reg)[1] || '0')

export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) =>
  spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
