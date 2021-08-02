export default {
  methods: {
    track(
      evtName,
      opts = {},
      userproperty = {},
      useBaseProps = true,
      callback,
    ) {
      opts = { ...this.$store.getters.loginBaseTrackOpts, ...opts }
      this.$track(evtName, opts, userproperty, useBaseProps, callback)
    },
  },
}
