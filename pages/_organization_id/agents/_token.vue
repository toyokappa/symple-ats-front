<template lang="pug">
v-card.pt-8.pb-16.mx-auto(
  max-width="480"
  flat
)
  v-form
    v-card-text
      .text-h5.font-weight-bold.mb-5 候補者推薦フォーム
      .text-h6.font-weight-bold.mb-2 候補者情報
      .grey--text.mb-1 候補者の氏名
      v-row(dense).mb-3
        v-col(cols="6")
          v-text-field.body-2(
            dense
            outlined
            hide-details="auto"
            placeholder="姓"
          )
        v-col(cols="6")
          v-text-field.body-2(
            dense
            outlined
            hide-details="auto"
            placeholder="名"
          )
      .grey--text.mb-1 応募ポジション
      v-autocomplete.body-2.mb-3(
        dense
        outlined
        hide-details="auto"
        placeholder="未選択"
      )
      .grey--text.mb-1 レジュメ
      v-file-input.body-2.mb-3(
        dense
        outlined
        multiple
        small-chips
        show-size
        hide-details="auto"
        placeholder="未入力"
      )
      .grey--text.mb-1 推薦文
      v-textarea.body-2(
        dense
        outlined
        hide-details="auto"
        placeholder="任意"
      )
      v-divider.my-5
      .text-h6.font-weight-bold 紹介者情報
      .caption.grey--text.mb-3 入力いただいた内容は一定期間保存されます。
      .grey--text.mb-1 紹介者の所属
      v-text-field.body-2.mb-1(
        value="JACリクルートメント"
        dense
        outlined
        readonly
        hide-details="auto"
      )
      .caption.grey--text.mb-3 所属名が異なる場合は担当企業の採用担当者へご連絡ください。
      .grey--text.mb-1 紹介者の氏名
      v-row(dense).mb-3
        v-col(cols="6")
          v-text-field.body-2(
            dense
            outlined
            hide-details="auto"
            placeholder="姓"
          )
        v-col(cols="6")
          v-text-field.body-2(
            dense
            outlined
            hide-details="auto"
            placeholder="名"
          )
      .grey--text.mb-1 紹介者のメールアドレス
      v-text-field.body-2.mb-5(
        type="email"
        dense
        outlined
        hide-details="auto"
      )
      v-btn(
        block
        color="primary"
        dense
      ) 候補者を推薦する
</template>

<script>
export default {}
</script>
