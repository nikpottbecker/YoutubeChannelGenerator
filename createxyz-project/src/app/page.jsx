"use client";
import React from "react";
import * as ChakraUI from "@chakra-ui/react";
import * as ShadcnUI from "@/design-libraries/shadcn-ui";
import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { toast } = ShadcnUI.useToast();
  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
      setStreamingMessage("");
      setLoading(false);
    },
  });

  const generateChannelIdeas = async () => {
    if (!interests.trim()) {
      toast({
        title: "Error",
        description: "Please enter your interests first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Generate a YouTube channel concept based on these interests: ${interests}. Include: 1. Channel name 2. Channel description 3. 5 video ideas 4. Target audience 5. Recommended upload schedule 6. Tips for growth`,
          },
        ],
        stream: true,
      }),
    });
    handleStreamResponse(response);
  };

  return (
    <ChakraUI.ChakraProvider>
      <ChakraUI.Container maxW="3xl" py={8}>
        <ChakraUI.VStack spacing={6} align="stretch">
          <ChakraUI.Heading
            as="h1"
            size="xl"
            color="#FF0000"
            fontFamily="Roboto"
          >
            YouTube Channel Generator
          </ChakraUI.Heading>

          <ShadcnUI.Card>
            <div className="p-6">
              <ChakraUI.VStack spacing={4}>
                <ChakraUI.FormControl>
                  <ChakraUI.FormLabel fontFamily="Roboto">
                    What are your interests? (Separate with commas)
                  </ChakraUI.FormLabel>
                  <ShadcnUI.Textarea
                    placeholder="e.g., gaming, cooking, travel, technology..."
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="min-h-[100px]"
                  />
                </ChakraUI.FormControl>

                <ShadcnUI.Button
                  onClick={generateChannelIdeas}
                  disabled={loading || !interests}
                  className="w-full bg-[#FF0000] text-white hover:bg-[#CC0000] disabled:opacity-50"
                >
                  {loading ? (
                    <ChakraUI.Spinner size="sm" mr={2} />
                  ) : (
                    <i className="fab fa-youtube mr-2" />
                  )}
                  Generate Channel Ideas
                </ShadcnUI.Button>
              </ChakraUI.VStack>
            </div>
          </ShadcnUI.Card>

          {(streamingMessage || messages.length > 0) && (
            <ShadcnUI.Card>
              <div className="p-6">
                <ChakraUI.VStack align="stretch" spacing={4}>
                  {messages.map((msg, index) => (
                    <ChakraUI.Text
                      key={index}
                      fontFamily="Roboto"
                      whiteSpace="pre-wrap"
                    >
                      {msg.content}
                    </ChakraUI.Text>
                  ))}
                  {streamingMessage && (
                    <ChakraUI.Text fontFamily="Roboto" whiteSpace="pre-wrap">
                      {streamingMessage}
                    </ChakraUI.Text>
                  )}
                </ChakraUI.VStack>
              </div>
            </ShadcnUI.Card>
          )}
        </ChakraUI.VStack>
        <ShadcnUI.Toaster />
      </ChakraUI.Container>
    </ChakraUI.ChakraProvider>
  );
}

export default MainComponent;