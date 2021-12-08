<template>
  <div>
    <div v-if="error">
      <v-row justify="center">
        <v-dialog v-model="error" persistent>
          <v-card>
            <v-card-title class="text-h3">
              <p class="red--text">{{ getTitleError }}</p>
            </v-card-title>
            <v-card-text class="text-h5">
              <p>{{ getDescriptionError }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="error = false">
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: false,
    description: "",
  }),
  computed: {
    getTitleError() {
      return `An error of the following type:${String(this.description)
        .split(":")[0]
        .toString()}`;
    },
    getDescriptionError() {
      return `Error description: ${String(this.description)
        .split(":")[1]
        .toString()}`;
    },
  },
  errorCaptured(err) {
    this.error = true;
    this.description = err;
    return false;
  },
};
</script>

<style>
</style>