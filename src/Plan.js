// generated with gravit.io -> svgo -> svgr
// svgo -i source.svg --disable={mergePaths,prefixIds,cleanupIDs,removeTitle,removeDesc,removeViewBox} --enable=removeDimensions —pretty -o - | svgr --no-svgo > src/Plan.js
import React from "react";
import './Plan.css';

const sectors = [
  { id: 1, d: "M340 60.833V0h84l1 76.913h-26l-31-16.08h-28z" },
  { id: 2, d: "M258 62.5V0h82v60.833L258 62.5z" },
  { id: 3, d: "M182 63.333l76-.833V0h-76v63.333z" },
  { id: 4, d: "M182 63.143L105 65V0h77v63.143z" },
  { id: 5, d: "M105 107V-.125L-.313 1.231V107H105z" },
  { id: 6, d: "M90.14 166H-.187v-59H90.14v59z" },
  { id: 7, d: "M-.14 232v-66h90.28l.86 65.057L-.14 232z" },
  { id: 8, d: "M105 314.937v-83.88L0 232.08v82.857h105z" },
  { id: 9, d: "M141 231.057L170 249v66h-65v-83.943h36z" },
  { id: 10, d: "M226 315v-66h-56v66h56z" },
  { id: 11, d: "M309 315h-83v-66h83v66z" },
  { id: 12, d: "M306 145l47-51 61 51-61 53-47-53z" },
  { id: 13, d: "M315.853 134L283 129V84h32.853L353 94l-37.147 40z" },
  { id: 14, d: "M199 144l84-15V84h-84v60z" },
  { id: 15, d: "M146 144l-18-10.169V84h71v60h-53z" },
  { id: 16, d: "M199 224h-37l-49-37 33-43 29 15 24 2v63z" },
  { id: 17, d: "M285 223l-86 1v-63l84-8 2 70z" },
  { id: 18, d: "M353 198l-30 23-38 2-2-70 23-8 47 53z" },
];

const badges = [
  { id: 1, d: "M361.844 22.625a7.879 7.879 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.879 7.879 0 0 1-7.875-7.875z", textTransform: "translate(366.125 27.155)" },
  { id: 2, d: "M288 22.171a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875A7.88 7.88 0 0 1 288 22.171z", textTransform: "translate(292.375 26.405)" },
  { id: 3, d: "M210 28.921a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875A7.88 7.88 0 0 1 210 28.921z", textTransform: "translate(214.25 33.28)" },
  { id: 4, d: "M128 28.421a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875A7.88 7.88 0 0 1 128 28.421z", textTransform: "translate(131.75 32.655)" },
  { id: 5, d: "M30.5 35.171a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(35.5 39.655)" },
  { id: 6, d: "M24.5 129.171a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(28.75 133.655)" },
  { id: 7, d: "M19 201.092a7.879 7.879 0 0 1 7.875-7.875 7.879 7.879 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875A7.88 7.88 0 0 1 19 201.092z", textTransform: "translate(23.25 205.576)" },
  { id: 8, d: "M25.5 291.421a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(29.75 295.905)" },
  { id: 9, d: "M128 295.342a7.879 7.879 0 0 1 7.875-7.875 7.879 7.879 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(132.25 299.826)" },
  { id: 10, d: "M187 295.342a7.879 7.879 0 0 1 7.875-7.875 7.879 7.879 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(187.5 299.826)" },
  { id: 11, d: "M255.75 292.671a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(256.375 297.155)" },
  { id: 12, d: "M361.417 151.338a7.878 7.878 0 0 1 7.875-7.875 7.879 7.879 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.879 7.879 0 0 1-7.875-7.875z", textTransform: "translate(361.708 155.488)" },
  { id: 13, d: "M306 101.675a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(306.417 105.826)" },
  { id: 14, d: "M226.75 103.675a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(227.167 107.826)" },
  { id: 15, d: "M152.625 103.675A7.88 7.88 0 0 1 160.5 95.8a7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.88 7.88 0 0 1-7.875-7.875z", textTransform: "translate(153.042 107.826)" },
  { id: 16, d: "M144.417 196.671a7.879 7.879 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.88 7.88 0 0 1-7.875 7.875 7.879 7.879 0 0 1-7.875-7.875z", textTransform: "translate(144.833 200.822)" },
  { id: 17, d: "M226.75 202.004a7.88 7.88 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.879 7.879 0 0 1-7.875 7.875 7.879 7.879 0 0 1-7.875-7.875z", textTransform: "translate(227.167 206.155)" },
  { id: 18, d: "M313.417 193.004a7.879 7.879 0 0 1 7.875-7.875 7.88 7.88 0 0 1 7.875 7.875 7.879 7.879 0 0 1-7.875 7.875 7.878 7.878 0 0 1-7.875-7.875z", textTransform: "translate(313.708 197.405)" },
]

// We want the whole sector area to trigger a hover/click, but we only want
// the part on the wall to get highlighted, so we duplicate the path,
// one for events/:hover, and a clipped one (with a mask) to actually get hightlighted
const Sector = ({ d, id }) => (
  <g className="Plan-sector">
    <path
      d={d}
      id={`sector-${id}`}
      vectorEffect="non-scaling-stroke"
    />
    <path
      d={d}
      className="Plan-sector-highlight"
      vectorEffect="non-scaling-stroke"
      mask="url(#highlight-mask)"
    />
  </g>
)

const Badge = ({ d, id, textTransform }) => (
  <g id={`badge-${id}`}>
    <path
      d={d}
      vectorEffect="non-scaling-stroke"
      stroke="#000"
      strokeLinecap="square"
      strokeMiterlimit={3}
    />
    <text
      transform={textTransform}
      fontFamily="Open Sans"
      fontWeight={700}
      fontSize={12}
      fill="#fff"
    >
      {id}
    </text>
  </g>
)

const Plan = props => (
  <svg style={{ isolation: "isolate" }} viewBox="0 0 560 315" {...props}>
    <defs>
      <clipPath id="_clipPath_DS6Fbl1Pjoa77teAAsvmS6agZhjT8QYH">
        <path d="M0 0h560v315H0z" />
      </clipPath>
      {/* WALL PATHS USED IN MASK - We want those to have one fill color in the drawing,
          and another (black/white) in the sector highlighting mask.
          But <use> won't let us override existing fill colors, so we need to define them
          fillless here in defs, then use them both in the image and in the mask */}
      <path
        id="wall"
        d="M538 285v-7l-20-9-9-6-9-9-27-5-33 14-40 2-7-6-40 1-9 6-39 2-15-8-48 1-16 10-59 2-46-30-26 11H71l-2-102-1-35v-7L55 99v-9l20-6 11-11 12-24 62 2 31-1 83-2 20 5 26-5h52l29 15 10-1 34-15 30 1 19 4 8-1 8 19v26l-7 6h-31l-11 4v2l61-1V61l-6-19-71-2-21 8h-15l-21-10h-92l-22.25 4.25-29.75.583-62.333-6L98.25 44.25 79 43l-19 6-17 28v14l13 16v59l-11 6 1 106 75-3 47 5 15 3 125-5 1 7h11l14-11 9-2 6-4 29 2 46 11 99-3 15 7z"
        vectorEffect="non-scaling-stroke"
        stroke="#797979"
      />
      <path
        id="bear"
        d="M283 187l-42 2-81-7-24-19-2-25 24-14 20 9 52-7 61-15 23 2 26 21v3l8 5 2 3-2 4-9 5v2l-28 20-28 11z"
        vectorEffect="non-scaling-stroke"
        stroke="#797979"
      />
      <path
        id="bear-back"
        d="M154.563 129.688l-10.75 23-7.625 5.25 7.625-5.375 21.375 17.125-6 6.625 6-6.625 37.312.812 1.125 11.375L202.5 170.5l42.875 4.563-5.625 8.25 5.625-8.25 23-3.375 13.5 10-13.5-10.125 44.5-13.938-13.75 19 13.75-18.875-5.5 19.625 5.5-19.625 11.75-4-.25 4.25.25-4.375.75-19.125.5-4.75-.375 4.75-29-12.625.125-6.625-.125 6.625-59.812 16.313 9.375-11.625-9.25 11.5-34.688 3.812.875-8.25-.875 8.25L176 140.563l-21.437-10.875z"
        vectorEffect="non-scaling-stroke"
        stroke="#AEAEAE"
      />
      {/* END WALL PATHS */}
      <mask id="highlight-mask">
        <rect id="bg" x="0" y="0" width="100%" height="100%" fill="black"/>
        <use xlinkHref="#bear" fill="white" />
        <use xlinkHref="#bear-back" fill="black" />
        <use xlinkHref="#wall" fill="white" />
      </mask>
    </defs>
    <g clipPath="url(#_clipPath_DS6Fbl1Pjoa77teAAsvmS6agZhjT8QYH)">

      <g style={{ isolation: "isolate" }} id="badges">
        { badges.map(props => <Badge key={`badge-${props.id}`} {...props} />) }
      </g>

      <g
        style={{ isolation: "isolate" }}
        id="contours"
        strokeLinecap="square"
        strokeMiterlimit={3}
      >
        <path
          d="M336.188 144.313l3.437 9.125 2.375-8.813-2.094-7.219-3.718 6.907z"
          fill="none"
          vectorEffect="non-scaling-stroke"
          stroke="#AEAEAE"
        />
        <use xlinkHref="#bear" fill="none" />
        <g style={{ isolation: "isolate" }} id="ours-features">
          <path
            d="M319 128l7 2 2-6-2-4-7 2v6z"
            fill="#F4F4F4"
            vectorEffect="non-scaling-stroke"
            stroke="#797979"
          />
          <path
            d="M318 161v6l7 1v-4l-1-6-6 3z"
            fill="#F4F4F4"
            vectorEffect="non-scaling-stroke"
            stroke="#797979"
          />
          <path
            d="M339 153l3-8-2-9-4 9 3 8z"
            fill="none"
            vectorEffect="non-scaling-stroke"
            stroke="#AEAEAE"
          />
          <path
            d="M314.688 113.188l-16.625 1.437-53.75 12.063-41.375 6.75L176 140.5l-21.625-10.875-2-2.375 6-3.5 19.5 9.125L229.438 126l61.875-14.937 23.375 2.125z"
            fill="none"
            vectorEffect="non-scaling-stroke"
            stroke="#797979"
          />
          <path
            d="M305.813 177.906l-6.282-1.343-18.343 5.25-39.25 2.031-42.469-2-40.344-5.563-23.594-18.687.532 5.375L160.031 182l80.75 6.938 42.063-1.969 22.969-9.063z"
            fill="none"
            vectorEffect="non-scaling-stroke"
            stroke="#797979"
          />
          <use xlinkHref="#bear-back" fill="#F4F4F4" />
          <path
            d="M324.594 153.906l.75-19.812 10.187 10.125-10.937 9.687z"
            fill="#F4F4F4"
            vectorEffect="non-scaling-stroke"
            stroke="#AEAEAE"
          />
        </g>
        <use xlinkHref="#wall" fill="none" />
      </g>

      {/* Sectors must be at the bottom, so as to be hoverable/clickable on the top layer*/}
      <g
        style={{ isolation: "isolate" }}
        id="secteurs"
        fill="none"
        stroke="#EAEAEA"
        strokeLinecap="square"
        strokeMiterlimit={3}
      >
        { sectors.map(props => <Sector key={`sector-${props.id}`} {...props} />) }
      </g>

    </g>
  </svg>
);

export default Plan;

