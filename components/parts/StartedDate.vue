<template lang="pug"> 
.text-xs {{ date }}
</template>

<script>
export default {
  props: {
    date: {
      type: String
    }
  }
}
</script>