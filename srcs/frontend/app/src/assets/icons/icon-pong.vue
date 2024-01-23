<template>
      <svg xmlns="http://www.w3.org/2000/svg"  
        viewBox="0 0 1000 1000"
        font-size="24">
      <path class="spiral" 
          d="M100 50 
            C 100 116 12.5 99.5 12.5 50 
            C 12.5 0.5 75 9 75 50 
            C 75 83 37.5 74 37.5 50
            C 37.5 38 50 42 50 50"
          stroke="black" stroke-width="1" fill="none"/>
        <path  stroke-dashoffset="6265" stroke-dasharray="6265" d="m351 487c0 8-11 4-14-1-6-11 4-24 15-27 19-5 37 11 40 30 4 27-18 50-44 53-35 4-64-25-66-59-3-42 32-77 73-79 50-3 90 39 92 88 2 57-46 104-102 105-65 2-117-53-119-117-1-72 60-131 131-132 80-1 144 67 145 146 1 87-74 158-160 158-95 0-171-81-171-175 0-102 88-185 190-184 110 1 198 95 197 204C557 615 456 709 340 708 215 706 115 598 117 475 119 342 233 236 364 238 504 240 616 361 614 500 611 648 484 766 337 763 182 760 58 626 61 472 65 309 206 179 367 183c170 4 306 151 302 320-4 178-158 319-335 315" style="fill:none;stroke:#000" stroke-width="2">
          <animate attributeName="stroke-dashoffset" values="6265;0;6265;0" dur="200s" fill="freeze" />
        </path>
    </svg>
  </template>
  
  <script lang="ts">
  //https://www.w3schools.com/graphics/svg_examples.asp
  export default {
    name: 'iconPong',
    props: {
      //game: Object,
    },
    data() {
    return {
      }
    },
    setup() {
    }
  }
  </script>
  
  