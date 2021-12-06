<template>
  <v-dialog v-model="dialog" max-width="290" @click:outside="$emit('delete', false)">
    <v-card>
      <v-card-title class="text-h5">
      <slot name="title"></slot>
      </v-card-title>

      <v-card-text>
        <slot name="description"></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="$emit('delete', false)">
          Disagree
        </v-btn>

        <v-btn color="error darken-1" text @click="$emit('delete', true)">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteDialog",
  props: ["dialog"],
};
</script>

<style>
</style>