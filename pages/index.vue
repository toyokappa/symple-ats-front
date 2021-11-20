<template lang="pug"> 
.mx-auto.my-3
  parts-kanban-column(:kanban="kanban" :openModal="openModal")
  parts-modal(ref="kanbanModal")
    template(v-if="currentCard")
      .text-3xl.font-bold.mb-5
        template(v-if="currentCard.name") {{ currentCard.name }}
        .text-gray-300(v-else) 名前未入力
      .grid.grid-cols-6.mb-3.items-center
        .text-sm 選考状態
        .col-start-2.col-span-5
          .inline-block.text-xs.rounded.bg-gray-100.px-2(v-if="currentColumn.id > 1" :class="`py-0.5`") {{ currentColumn.name }}
          .text-sm.text-gray-300(v-else) 未入力
      .grid.grid-cols-6.mb-3.items-center
        .text-sm 担当者
        .col-start-2.col-span-5
          parts-recruiter(v-if="currentCard.recruiter" :recruiter="currentCard.recruiter")
          .text-sm.text-gray-300(v-else) 未入力
      .grid.grid-cols-6.mb-3.items-center
        .text-sm 応募媒体
        .col-start-2.col-span-5
          parts-media(v-if="currentCard.media" :media="currentCard.media")
          .text-sm.text-gray-300(v-else) 未入力
      .grid.grid-cols-6.mb-3.items-center
        .text-sm ポジション
        .col-start-2.col-span-5
          parts-position(v-if="currentCard.position" :position="currentCard.position")
          .text-sm.text-gray-300(v-else) 未入力
      .grid.grid-cols-6.mb-3.items-center
        .text-sm 選考開始日
        .col-start-2.col-span-5
          parts-started-date(:date="currentCard.startedDate")
</template>

<script>
export default {
  data() {
    const kanban = [
      {
        id: 1,
        name: '未選考状態',
        list: [
          {
            id: 1,
            columnId: 1,
            name: "シンプル 太郎",
            recruiter: {
              name: "toyokawa",
            },
            media: {
              name: "Green",
              color: "green",
            },
            position: {
              name: "エンジニア",
              color: "blue",
            },
            startedDate: "2021.11.01",
          },
          {
            id: 2,
            columnId: 1,
            name: "シンプル 次郎",
            recruiter: {
              name: "toyokawa",
            },
            media: {
              name: "JAC",
              color: "red",
            },
            position: {
              name: "エンジニア",
              color: "blue",
            },
            startedDate: "2021.11.01",
          },
        ],
      },
      {
        id: 2,
        name: '書類選考',
        list: [
          {
            id: 3,
            columnId: 2,
            name: "シンプル 三郎",
            recruiter: {
              name: "toyokawa",
            },
            media: {
              name: "Wantedly",
              color: "green",
            },
            position: {
              name: "デザイナー",
              color: "yellow",
            },
            startedDate: "2021.11.01",
          },
        ],
      },
      {
        id: 3,
        name: '1次面接',
        list: [
        ],
      },
      {
        id: 4,
        name: '2次面接',
        list: [
        ],
      },
      {
        id: 5,
        name: '内定',
        list: [
        ],
      },
      {
        id: 6,
        name: '内定承諾',
        list: [
        ],
      },
    ]
    return {
      kanban,
      currentCard: null,
    };
  },
  methods: {
    openModal(card) {
      this.currentCard = card
      this.$refs.kanbanModal.openModal()
    },
  },
  computed: {
    currentColumn() {
      return this.kanban.find(column => column.id === this.currentCard.columnId)
    }
  }
}
</script>

<style lang="sass" scoped>
.modal
  &__overlay
    display: flex
    align-items: center
    justify-content: center
    position: fixed
    z-index: 100
    top: 0
    left: 0
    height: 100%
    width: 100%
    background-color: rgba(0, 0, 0, 0.3)
  &__window
    height: 70%
    width: 70%
    max-width: 800px
    overflow: hidden
    background-color: white
  &__content
    height: 100%
    padding: 30px

.modal-enter-active, .modal-leave-active
  transition: opacity 0.4s
  .modal__window
    transition: opacity 0.4s, transform 0.4s
.modal-leave-active
  transition: opacity 0.6s ease 0.4s
.modal-enter, .modal-leave-to
  opacity: 0
  .modal__window
    opacity: 0
    transform: translateY(-20px)
</style>