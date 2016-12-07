module.exports = {
  /**
   * The standard bucket we upload everything to
   */
  Bucket: 'cdn.web-platform.io',

  /**
   * Takes a buildId and returns the S3 snapshot prefix
   */
  SnapshotPrefix: (buildId) => `orion-ui/orion/snapshot-${buildId}`
}