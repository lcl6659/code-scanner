import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['tutorBaseTrackOpts']),
  },
  methods: {
    track(
      evtName,
      opts = {},
      userproperty = {},
      useBaseProps = true,
      callback,
    ) {
      opts = { ...this.$store.getters.tutorBaseTrackOpts, ...opts }
      this.$track(evtName, opts, userproperty, useBaseProps, callback)
    },
  },
}
