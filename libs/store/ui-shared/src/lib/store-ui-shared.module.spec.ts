import { async, TestBed } from '@angular/core/testing';
import { StoreUiSharedModule } from './store-ui-shared.module';

describe('StoreUiSharedModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreUiSharedModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(StoreUiSharedModule).toBeDefined();
  });
});
