import {
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Text,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>(undefined);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      terms: true,
    },
    validateInputOnBlur: true,
    validate: {
      email: (val) => {
        return /^\S+@\S+$/.test(val) ? null : "Invalid email";
      },
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const onLogin = async () => {
    try {
      setError(undefined);
      setLoading(true);
      form.validate();
      await axios.post("/api/users/login", form.values);
      router.push("/profile");
    } catch (error: any) {
      setError((error as any).response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="lg" withBorder>
      <form onSubmit={form.onSubmit(onLogin)}>
        <Stack>
          {error && (
            <Box
              bg="red.5"
              my="xs"
              c="white"
              p="xs"
              style={{ borderRadius: "0.5rem" }}
            >
              <Text>{error}</Text>
            </Box>
          )}
          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            error={form.errors.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Button type="submit" radius="xl" disabled={loading}>
            Login
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
