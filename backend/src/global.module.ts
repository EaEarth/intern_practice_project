import { Global, Module } from '@nestjs/common';

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

@Global()
@Module({
  providers: [
    {
      provide: 'database',
      useValue: db,
    },
  ],
  exports: ['database'],
})
export class GlobalModule {}
