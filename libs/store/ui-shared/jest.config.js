module.exports = {
  name: 'store-ui-shared',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/store/ui-shared',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
