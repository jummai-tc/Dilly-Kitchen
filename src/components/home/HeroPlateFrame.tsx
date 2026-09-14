import { dishImages } from '@/data/menu'
import { buildSrcSet, smallestSrc } from '@/lib/images'
import { cn } from '@/lib/utils'
import type { DishImage } from '@/types'

/**
 * The home hero's backdrop on phones and tablets.
 *
 * The desktop hero opens on a corridor of dishes rushing out of the dark. That
 * corridor is built in `cqw` — every length is a share of the container's
 * width — so on a narrow window it collapses into a short grey band straight
 * across the middle of the type, which is the one place it must never be. The
 * same idea is rebuilt here for a tall, narrow frame instead: the food is held
 * in two rails down the left and right edges, drifting slowly in opposite
 * directions, with the whole centre channel left black for the words.
 *
 * The rails are masked rather than merely dimmed. Each one is solid at the
 * outer edge and gone before it reaches the centre, so a line of text that
 * runs the full width of a 320px phone still lands on black.
 */

/**
 * Six plates a side, ordered so that no two neighbours are the same colour —
 * a rail of rice after rice reads as one long smear. The two that open the
 * rails are the pair already preloaded in `index.html` for the desktop
 * corridor, so a phone spends no extra request on its first frame.
 */
const leftPlates: DishImage[] = [
  dishImages.jollofChicken,
  dishImages.efoRiro,
  dishImages.isiEwu,
  dishImages.puffPuff,
  dishImages.spaghettiJollof,
  dishImages.okraSoup,
]

const rightPlates: DishImage[] = [
  dishImages.beefSuya,
  dishImages.grilledCroaker,
  dishImages.friedRice,
  dishImages.meatPie,
  dishImages.tilapiaPepperSoup,
  dishImages.friedPlantain,
]

interface RailProps {
  plates: DishImage[]
  side: 'left' | 'right'
  /** False under `prefers-reduced-motion` — the rail then holds a still. */
  animate: boolean
}

function Rail({ plates, side, animate }: RailProps) {
  /*
   * The track is twice the height of the frame and carries the plates twice,
   * so a translate of -50% lands on a frame identical to the first and the
   * loop is seamless. Twelve children at a twelfth of the track each means
   * six plates on screen at any moment, whatever the height of the hero —
   * enough that each tile crops to roughly the square the photographs were
   * shot at, so a rail reads as dishes rather than as texture.
   */
  const track = [...plates, ...plates]

  return (
    <div
      className={cn(
        'absolute inset-y-0 w-[30%] overflow-hidden opacity-95 [filter:saturate(1.25)_contrast(1.04)] sm:w-[28%]',
        side === 'left' ? 'left-0 plate-rail-left' : 'right-0 plate-rail-right',
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 flex h-[200%] flex-col',
          /*
           * Written out in full rather than composed: Tailwind reads these
           * files as plain text, so a class it cannot see spelled out is a
           * class it never generates. Slow — 52s a turn reads as drift, not
           * travel — and the rails run against each other.
           *
           * The right rail is also off the left one's beat — a quarter turn
           * when it moves, half a tile when it holds still. Both rails cut
           * their plates at the same heights, so in step the joins line up
           * across the window and the two of them read as one wall.
           */
          animate
            ? side === 'left'
              ? 'animate-[plate-rail_52s_linear_infinite]'
              : 'animate-[plate-rail_52s_linear_infinite_reverse] [animation-delay:-13s]'
            : side === 'right' && '-translate-y-[4.1666%]',
        )}
      >
        {track.map((image, index) => (
          /*
           * The tiles butt straight up against one another. A gap between
           * them puts a black rule across the rail at a fixed height, and
           * with a rail on each side of the window those rules read as a
           * blind pulled across the whole hero.
           */
          <div key={`${side}-${index}`} className="h-[8.3333%]">
            <img
              src={smallestSrc(image)}
              srcSet={buildSrcSet(image)}
              sizes="(min-width: 640px) 28vw, 30vw"
              alt=""
              /* Only the plate at the top of each rail is on screen first. */
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : undefined}
              decoding="async"
              className="size-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroPlateFrame({ animate }: { animate: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Rail plates={leftPlates} side="left" animate={animate} />
      <Rail plates={rightPlates} side="right" animate={animate} />

      {/*
        The scrims, in the same order as the desktop hero: an overall veil; a
        deep well down the centre so the type never sits on a moving edge; the
        warm ceiling light of the room across the top; the black band the fixed
        header dissolves into; the deep floor that carries the brass rail; and
        a vignette to bind the frame.
      */}
      <div className="absolute inset-0 bg-ink-950/40" />
      <div className="absolute inset-0 bg-[radial-gradient(76%_54%_at_50%_42%,rgb(8_8_7/0.98),rgb(8_8_7/0.93)_40%,rgb(8_8_7/0.55)_72%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(85%_36%_at_50%_0%,rgb(207_162_53/0.15),transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950 via-ink-950/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_82%_at_50%_50%,transparent_46%,rgb(8_8_7/0.52))]" />
    </div>
  )
}
