<template>
<div>
  <Party>
  </Party>
</div>
</template>

<script>
export default {
  head() {
    return {
      title: `AIN'T NO PARTY LIKE A ${this.$route.params.party.toUpperCase()} PARTY`
    }
  },
  
  mounted() {
  },
}
</script>

