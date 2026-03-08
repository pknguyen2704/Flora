import { Box, Tooltip } from "@mui/material"

export default function PhonemeTimeline({ phones }) {

    return (

        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1, flexWrap: "wrap" }}>

            {phones.map((p, i) => {

                const color = p.correct ? "#10B981" : "#EF4444"

                return (

                    <Tooltip
                        key={i}
                        title={p.heard ? `heard ${p.heard}` : "correct"}
                    >

                        <Box
                            sx={{
                                background: color,
                                color: "white",
                                px: 1.3,
                                py: 0.4,
                                borderRadius: 1,
                                fontWeight: 700,
                                fontSize: "0.8rem"
                            }}
                        >

                            {p.phone}

                        </Box>

                    </Tooltip>

                )

            })}

        </Box>

    )
}