<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-white text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs">
            <q-icon name="local_activity" color="cyan" size="28px" />
            <p shrink class="font-semibold text-2xl pl-1 text-cyan-600">
              TixPlaza
            </p>
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
