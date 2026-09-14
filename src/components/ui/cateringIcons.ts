/** Maps `CateringOption.icon` keys to their icon components. */
import {
  BriefcaseIcon,
  CakeIcon,
  HomeIcon,
  RingsIcon,
  SparkleIcon,
  UsersIcon,
} from './Icons'

export const cateringIcons = {
  rings: RingsIcon,
  cake: CakeIcon,
  briefcase: BriefcaseIcon,
  home: HomeIcon,
  sparkle: SparkleIcon,
  users: UsersIcon,
} as const

export type CateringIconKey = keyof typeof cateringIcons
