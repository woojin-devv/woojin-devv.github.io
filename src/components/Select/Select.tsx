import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

import * as styles from './Select.module.scss'

export type SelectOption = {
  label: string
  value: string
}

type SelectProps = {
  ariaLabelledBy?: string
  disabled?: boolean
  onValueChange: (value: string) => void
  options: readonly SelectOption[]
  placeholder?: string
  value: string
}

export const Select = ({
  ariaLabelledBy,
  disabled,
  onValueChange,
  options,
  placeholder,
  value,
}: SelectProps) => (
  <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
    <SelectPrimitive.Trigger className={styles.trigger} aria-labelledby={ariaLabelledBy}>
      <SelectPrimitive.Value placeholder={placeholder} />
      <SelectPrimitive.Icon className={styles.triggerIcon}>
        <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>

    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={styles.content}
        position="popper"
        sideOffset={6}
        collisionPadding={12}
      >
        <SelectPrimitive.ScrollUpButton className={styles.scrollButton}>
          <ChevronUp size={15} aria-hidden="true" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className={styles.viewport}>
          {options.map((option) => (
            <SelectPrimitive.Item className={styles.item} key={option.value} value={option.value}>
              <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className={styles.itemIndicator}>
                <Check size={15} strokeWidth={2} aria-hidden="true" />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className={styles.scrollButton}>
          <ChevronDown size={15} aria-hidden="true" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
)
