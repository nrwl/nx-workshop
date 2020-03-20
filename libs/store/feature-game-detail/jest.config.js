module.exports = {
  name: 'store-feature-game-detail',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/store/feature-game-detail',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
