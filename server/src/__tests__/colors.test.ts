import {nextHue} from "../colors";

describe('nextHue', () => {

  it('returns a random hue between 0-360 when provided an empty array', () => {
    const hue = nextHue([])
    expect(hue).toBeGreaterThanOrEqual(0)
    expect(hue).toBeLessThan(360)
  })

  it('returns a hue 180 degress offset when provided an array of one value', () => {
    const hue = nextHue([330])
    expect(hue).toEqual(150)
  })

  describe('with more than 1 input colors', () => {
    const cases: [number[], number][] = [
      [[0, 359], 179],
      [[0, 180], 90],
      [[0, 180, 90], 270],
      [[0, 180, 90, 270], 45],
      [[0, 180, 90, 270, 45], 135],
    ]
    test.each(cases)('it returns a hue that is in the middle of the greatest distance between the points', (input, output) => {
      expect(nextHue(input)).toEqual(output)
    })

  })
})
