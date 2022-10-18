import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';

export default {
  title: 'HeaderComponent',
  component: HeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [MatToolbarModule],
    }),
  ],
} as Meta<HeaderComponent>;

const Template: Story<HeaderComponent> = (args: HeaderComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  title: '',
};
