import { Box } from '@/components/ui/box';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
interface ScreenLayoutProps {
    title: string;
    description?: string;
    icon?: string;
    children: React.ReactNode;
}
export default function ScreenLayout({ title, description, icon, children }: ScreenLayoutProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Box style={{ paddingHorizontal: 16}}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>{title}</Text>
                <Text style={{ fontSize: 16, color: colors.textMuted }}>{description}</Text>
            </Box>
            {children}
        </SafeAreaView>
    )
}