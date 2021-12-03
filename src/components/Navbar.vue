<template>
  <nav>
    <v-app-bar flat app>
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span>
          <span>Negtive Caption </span>
          <span class="font-weight-light">Annotation</span>
        </span>
      </v-toolbar-title>
    </v-app-bar>

    <!-- <v-navigation-drawer v-model="drawer" app class="blue-grey lighten-1">
      <v-list>
        <v-list-item v-for="link in links" :key="link.text" :to="link.route">
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              link.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
  </nav>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    links: [{ icon: "mdi-home", text: "Home", route: "/" }],
  }),
};
</script>
