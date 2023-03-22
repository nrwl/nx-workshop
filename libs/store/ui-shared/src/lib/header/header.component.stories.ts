import { Meta } from '@storybook/angular';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';

export default {
  title: 'HeaderComponent',
  component: HeaderComponent,
} as Meta<HeaderComponent>;

export const Primary = {
  render: (args: HeaderComponent) => ({
    props: args,
  }),
  args: {
    title: '',
  },
};
