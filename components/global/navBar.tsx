import { Navbar, Text, useTheme } from "@nextui-org/react";


export const NavBar = (): JSX.Element => {
    const { isDark } = useTheme();

    return (
            <>
            <Navbar isBordered={isDark} variant={"static"}>
                <Navbar.Brand>
                    <Text b color="inherit" hideIn="xs">
                        VISTIMI
                    </Text>
                </Navbar.Brand>
                <Navbar.Content hideIn="xs">
                    <Navbar.Link href="/pictures/process">process</Navbar.Link>
                    <Navbar.Link href="/pictures/validation">validation</Navbar.Link>
                    <Navbar.Link href="/pictures/production">production</Navbar.Link>
                    <Navbar.Link href="/pictures/blocked">blocked</Navbar.Link>
                    <Navbar.Link href="/tags/tags">tags</Navbar.Link>
                    <Navbar.Link href="/users/users">users</Navbar.Link>
                </Navbar.Content>
            </Navbar>
            <br /></>
    );
}

