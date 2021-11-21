export const kanban = [
  {
    id: 1,
    name: '未選考状態',
    list: [
      {
        id: 1,
        columnId: 1,
        name: "シンプル 太郎",
        recruiterId: 1,
        mediaId: 1,
        positionId: 1,
        startedDate: new Date("2021.11.01"),
        selectionResults: [
          {
            id: 1,
            columnId: 2,
            columnName: '書類選考', // 暫定的に追加
            totalResult: '合格',
            individualResults: [
              {
                id: 1,
                selectionResultId: 1,
                recruiterId: 1,
                result: '合格',
                inputDate: new Date("2021.11.10"),
                description: 'とても良かったです。'
              },
              {
                id: 2,
                selectionResultId: 1,
                recruiterId: 2,
                result: '不合格',
                inputDate: new Date("2021.11.11"),
                description: '若干悩んだ。'
              },
            ]
          },
          {
            id: 2,
            columnId: 3,
            columnName: '1次面接', // 暫定的に追加
            totalResult: '不合格',
            individualResults: [
              {
                id: 1,
                selectionResultId: 2,
                recruiterId: 1,
                result: '不合格',
                inputDate: new Date("2021.11.12"),
                description: '話した感じ物足りなかったです。'
              },
            ]
          }
        ]
      },
      {
        id: 2,
        columnId: 1,
        name: "シンプル 次郎",
        recruiterId: 2,
        mediaId: 2,
        positionId: 2,
        startedDate: new Date("2021.11.02"),
        selectionResults: [],
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
        recruiterId: 3,
        mediaId: 3,
        positionId: 3,
        startedDate: new Date("2021.11.03"),
        selectionResults: [],
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

export const recruiterList = [
  {
    id: 1,
    name: 'toyokawa',
  },
  {
    id: 2,
    name: 'yamada',
  },
  {
    id: 3,
    name: 'tanaka',
  },
]

export const mediaList = [
  {
    id: 1,
    name: 'Wantedly',
    color: 'green',
  },
  {
    id: 2,
    name: 'Green',
    color: 'green',
  },
  {
    id: 3,
    name: 'JAC',
    color: 'red',
  },
]

export const positionList = [
  {
    id: 1,
    name: 'エンジニア',
    color: 'blue',
  },
  {
    id: 2,
    name: 'デザイナー',
    color: 'yellow',
  },
  {
    id: 3,
    name: 'ポテ枠',
    color: 'gray',
  },
]